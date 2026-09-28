# Backend API Guide

Frontend integration reference for the Express and MongoDB API.

## Running the API

From the `server` directory:

```bash
npm install
npm run dev
```

The server requires these environment variables in `server/.env`:

```env
MONGO_URI=<mongodb connection string>
PORT=5000
ACCESS_TOKEN_SECRET=<secret>
REFRESH_TOKEN_SECRET=<secret>
```

Use `http://localhost:3000` as the API origin. All routes are under `/api`. JSON request bodies are supported. Responses are JSON unless noted.

> Browser note: this server does not currently register CORS middleware. A frontend hosted on a different origin cannot call it directly from a browser until CORS is configured. During development, use a same-origin dev-server proxy or enable and configure CORS in the backend. For cross-origin cookie requests, the frontend also needs `credentials: "include"` and the backend cookie/CORS settings must permit credentials.

## Authentication

Access tokens expire after 15 minutes. Send them on protected requests as:

```http
Authorization: Bearer <accessToken>
```

Registration and login also set an HTTP-only `refreshToken` cookie. The browser manages this cookie; JavaScript cannot read it. Include credentials when calling cookie-based auth endpoints, especially `/api/auth/refresh-token` and `/api/auth/logout`.

Typical frontend flow:

1. Call `POST /api/auth/register` or `POST /api/auth/login`.
2. Keep the returned `accessToken` in the app's chosen client-side auth state and attach it to protected requests.
3. On an expired access token, call `POST /api/auth/refresh-token` with credentials enabled, then retry with the returned access token.
4. Call `POST /api/auth/logout` to revoke the refresh token and clear its cookie.

Roles are `user` and `admin`. Newly registered accounts receive the `user` role. Product create/update/delete and order-status updates require an admin access token.

## Routes

`Auth` means the access-token header is required. `Admin` means both authentication and the admin role are required. Object IDs are MongoDB IDs.

### Authentication: `/api/auth`

| Method | Path             | Access         | Request                                                                                              | Success                                                                                                    |
| ------ | ---------------- | -------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| POST   | `/register`      | Public         | `{ "name": "Sam", "email": "sam@example.com", "password": "secret1", "confirmPassword": "secret1" }` | `201`; `{ success, message, user: { id, name, email }, accessToken }`; sets refresh cookie                 |
| POST   | `/login`         | Public         | `{ "email": "sam@example.com", "password": "secret1" }`                                              | `200`; `{ success, message, data: { user: { id, name, email, role } }, accessToken }`; sets refresh cookie |
| POST   | `/refresh-token` | Refresh cookie | No body                                                                                              | `200`; `{ success, message, data: { user: { id, name, email, role } }, accessToken }`; rotates cookie      |
| POST   | `/logout`        | Auth           | No body                                                                                              | `200`; `{ success, message }`; clears refresh cookie                                                       |
| GET    | `/me`            | Auth           | No body                                                                                              | `200`; `{ success, user: { id, name, email, role } }`                                                      |

Registration requires all fields, a valid email, a password at least 6 characters long, and matching `password`/`confirmPassword`. Login requires a valid email and password of at least 6 characters.

### Products: `/api/products`

| Method | Path   | Access | Request/query                                                          | Success                                                                                                                        |
| ------ | ------ | ------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/`    | Public | Optional `page`, `limit`, `search`, `category`, `minPrice`, `maxPrice` | `200`; `{ data: [product, ...], pagination: { currentPage, limit, totalProducts, totalPages, hasNextPage, hasPreviousPage } }` |
| GET    | `/:id` | Public | MongoDB product ID                                                     | `200`; `{ message, product }`                                                                                                  |
| POST   | `/`    | Admin  | Product JSON below                                                     | `201`; `{ success, message, product }`                                                                                         |
| PUT    | `/:id` | Admin  | Any subset of product fields below                                     | `200`; `{ success, message, data: product }`                                                                                   |
| DELETE | `/:id` | Admin  | MongoDB product ID                                                     | `200`; `{ message, data: deletedProduct }`                                                                                     |

Create product body (only `name`, `description`, `price`, and `category` are required):

```json
{
  "name": "Desk lamp",
  "description": "Adjustable LED lamp",
  "price": 39.99,
  "category": "Home",
  "stock": 12,
  "image": "https://example.com/lamp.jpg"
}
```

`price` must be non-negative. `stock`, if provided, must be a non-negative integer; it defaults to `0`. `image` must be a URL when provided. Product records include `_id`, `name`, `description`, `price`, `category`, `stock`, `image`, `createdBy`, `createdAt`, and `updatedAt`.

### Cart: `/api/cart`

All cart routes require authentication. Cart items include a populated `product` object in responses, plus `quantity`.

| Method | Path     | Request                                                                                 | Success                                                                           |
| ------ | -------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| GET    | `/`      | None                                                                                    | `200`; `{ data: cart }`. Creates and returns an empty cart if one does not exist. |
| POST   | `/`      | `{ "productId": "<product id>", "quantity": 1 }` (`quantity` optional; defaults to `1`) | `200`; `{ message, data: cart }`                                                  |
| PUT    | `/`      | `{ "productId": "<product id>", "quantity": 2 }`                                        | `200`; `{ message, data: cart }`; sets that cart item's quantity                  |
| DELETE | `/`      | `{ "productId": "<product id>" }`                                                       | `200`; `{ message, data: cart }`; removes that item                               |
| DELETE | `/clear` | None                                                                                    | `200`; `{ message, data: cart }`; empties the cart                                |

Quantities must be integers of at least `1`. Add/update checks current product stock. Missing products/items and insufficient stock return an error response. `DELETE /` needs a JSON body containing `productId`.

### Orders: `/api/orders`

All order routes require authentication unless marked Admin. Users can access only their own orders.

| Method | Path          | Access | Request/query                           | Success                                                                                                                    |
| ------ | ------------- | ------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/`           | Auth   | No body; checkout uses the current cart | `201`; `{ message, data: order }`                                                                                          |
| GET    | `/`           | Auth   | Optional `status`, `page`, `limit`      | `200`; `{ data: [order, ...], pagination: { currentPage, limit, totalOrders, totalPages, hasNextPage, hasPreviousPage } }` |
| GET    | `/:id`        | Auth   | MongoDB order ID                        | `200`; `{ data: order }`                                                                                                   |
| PATCH  | `/:id/cancel` | Auth   | MongoDB order ID; no body               | `200`; `{ message, data: order }`                                                                                          |
| PATCH  | `/:id/status` | Admin  | `{ "status": "confirmed" }`             | `200`; `{ success, message, data: order }`                                                                                 |

Allowed status values: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`. A customer can cancel an order while its status is `pending` or `confirmed`. Admin status transitions are `pending` to `confirmed` or `cancelled`, `confirmed` to `shipped` or `cancelled`, and `shipped` to `delivered`. `delivered` and `cancelled` are terminal.

Checkout requires a non-empty cart, checks stock, decrements stock, creates an order with item prices and `totalAmount`, then clears the cart. Order items contain `product`, `quantity`, and the price captured at checkout. Responses populate each item's product reference.

## Errors and status codes

Error payloads are not fully uniform across routes. Common shapes include `{ message }`, `{ success: false, message }`, and validation errors `{ message: "Invalid data", errors: [...] }`. Frontend code should use the HTTP status and handle a missing `errors` array. Common statuses include `400` for invalid input, `401` for missing/invalid auth, `403` for non-admin access, and `404` for missing resources. Some controller failures currently return `500` even when the underlying problem is a business-rule error; see caveats below.

## Current implementation caveats

These behaviors are present in the backend code and should be fixed before relying on them in production:

- Refresh currently fails: the controller passes a token string to `readRefreshToken`, but the helper expects different parameters and verifies an undefined variable. The refresh route will return `401` until the helper is corrected.
- Product list filters are currently ineffective: `search`, `category`, `minPrice`, and `maxPrice` are parsed but the database query does not use the resulting filter. The total count is also unfiltered.
- Product list `limit` handling does not enforce a normal default/maximum: the current expression effectively returns at least `50` and has no upper cap.
- The orders controller catches errors from checkout and cancellation and responds with `500`, including empty-cart, insufficient-stock, or non-cancellable-order cases. The frontend cannot reliably distinguish those cases by status yet.
- The auth middleware returns `400` when the Authorization header is missing, while invalid/expired tokens return `401`.
