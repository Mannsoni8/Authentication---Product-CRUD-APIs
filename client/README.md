# Frontend - ShopHub E-Commerce

A modern, responsive e-commerce frontend built with React, Vite, Tailwind CSS, and React Router. Features a complete shopping experience with dark/light theme toggle.

---

## 🎨 Features

- ✅ **Modern UI/UX** - Clean, professional design with smooth animations
- 🌓 **Dark/Light Theme** - Toggle between themes with localStorage persistence
- 📱 **Fully Responsive** - Mobile-first design that works on all screen sizes
- 🔐 **Authentication** - User registration, login, and JWT-based session management
- 🛍️ **Product Browsing** - Browse products with detailed product pages
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities, real-time totals
- 📦 **Order Management** - Place orders, view order history, cancel orders
- ⚡ **Fast Performance** - Vite for lightning-fast HMR and builds
- 🎯 **Type-Safe Routing** - React Router v7 with modern routing patterns

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see `../server/README.md`)

### Installation

```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production deployment, update this to your deployed backend URL.

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
client/
├── public/              # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── app/            # App configuration
│   │   ├── App.jsx     # Root component
│   │   └── router.jsx  # Route definitions
│   ├── assets/         # Images and static files
│   ├── components/     # Reusable components
│   │   ├── cart/       # Cart-specific components
│   │   │   └── CartItem.jsx
│   │   ├── layout/     # Layout components
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   └── product/    # Product components
│   │       └── ProductCard.jsx
│   ├── context/        # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── ThemeContext.jsx   # Theme management
│   ├── hooks/          # Custom React hooks
│   │   └── useAuth.js
│   ├── pages/          # Page components
│   │   ├── auth/       # Auth pages
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── cart/       # Cart page
│   │   │   └── Cart.jsx
│   │   ├── orders/     # Order pages
│   │   │   ├── Orders.jsx
│   │   │   └── OrderDetails.jsx
│   │   ├── products/   # Product pages
│   │   │   ├── Products.jsx
│   │   │   └── ProductDetails.jsx
│   │   └── Home.jsx    # Landing page
│   ├── services/       # API service layer
│   │   ├── api.js             # Axios instance
│   │   ├── auth.service.js    # Auth API calls
│   │   ├── cart.service.js    # Cart API calls
│   │   ├── order.service.js   # Order API calls
│   │   └── product.service.js # Product API calls
│   ├── index.css       # Global styles & theme variables
│   └── main.jsx        # App entry point
├── index.html          # HTML template
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Theme System

The app includes a dark/light theme system with automatic persistence.

### Usage

```jsx
import { useTheme } from "./context/ThemeContext.jsx";

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### CSS Variables

Theme colors are defined in `src/index.css` using CSS custom properties:

```css
:root {
  --color-bg-primary: 249 250 251;
  --color-text-primary: 17 24 39;
  /* ... */
}

.dark {
  --color-bg-primary: 17 24 39;
  --color-text-primary: 243 244 246;
  /* ... */
}
```

Use with Tailwind:
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

---

## 🔐 Authentication Flow

### How It Works

1. **Registration/Login**: User submits credentials → Backend returns `accessToken` + sets `refreshToken` cookie
2. **Protected Requests**: Frontend attaches `Authorization: Bearer <accessToken>` header
3. **Token Refresh**: When access token expires, frontend calls `/api/auth/refresh-token` with cookie
4. **Logout**: Clears local state and calls `/api/auth/logout` to invalidate refresh token

### Implementation

```javascript
// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true, // Send cookies with requests
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

The `AuthContext` manages the token state and provides `login`, `register`, `logout`, and `refresh` functions to the entire app.

---

## 🛒 Shopping Flow

### 1. Browse Products
- Visit `/products` to see all available products
- Click any product card to view details

### 2. Add to Cart
- On product detail page, select quantity
- Click "Add to Cart" (requires login)

### 3. View Cart
- Click "Cart" in navigation
- Adjust quantities or remove items
- See real-time total

### 4. Checkout
- Click "Proceed to Checkout"
- Creates order from cart contents
- Redirects to order confirmation

### 5. Order Management
- View all orders at `/orders`
- Click an order to see details
- Cancel orders with status `pending` or `confirmed`

---

## 📡 API Integration

All API calls are centralized in the `services/` directory.

### Example: Fetching Products

```javascript
// src/services/product.service.js
import api from "./api.js";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};
```

### Usage in Components

```jsx
import { useEffect, useState } from "react";
import { getProducts } from "../../services/product.service.js";

function Products() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();
      setProducts(response.data);
    };
    fetchProducts();
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

---

## 🎯 Key Pages

### Home (`/`)
- Hero section with CTA
- Featured products grid
- Feature highlights
- Call-to-action sections

### Products (`/products`)
- Grid of all products
- Product cards with image, name, price, stock

### Product Details (`/products/:id`)
- Large product image
- Description, price, stock info
- Quantity selector
- Add to cart button

### Cart (`/cart`)
- List of cart items
- Quantity adjustment controls
- Real-time total calculation
- Clear cart & checkout buttons

### Orders (`/orders`)
- List of user's orders
- Order ID, status, total amount
- Click to view details

### Order Details (`/orders/:id`)
- Full order breakdown
- Product list with quantities
- Total amount
- Cancel button (if eligible)

### Auth Pages
- Login (`/login`)
- Register (`/register`)

---

## 🐛 Known Issues & Fixes

### Issue: Registration Fails with "Confirm password is required"
**Fixed** ✅ - Added `confirmPassword` field to registration form

### Issue: Cart Page Crashes on Load
**Fixed** ✅ - Moved `items` declaration before `totalItems` and `totalPrice` calculations

### Issue: ProductDetails Shows Undefined Data
**Fixed** ✅ - Changed `response.data` to `response.product` to match backend response structure

### Issue: Refresh Token Endpoint Returns 404
**Fixed** ✅ - Updated service to call `/auth/refresh-token` instead of `/auth/refresh`

### Issue: Checkout Button Goes to Non-Existent Route
**Fixed** ✅ - Replaced navigation to `/checkout` with direct order creation and redirect to order details

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy frontend"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set **Root Directory** to `client`
   - Add environment variable:
     - `VITE_API_BASE_URL` = `https://your-backend.vercel.app/api`
   - Click **Deploy**

3. **Done!** Your frontend will be live at `https://your-project.vercel.app`

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

---

## 🔧 Customization

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --color-primary: 99 102 241; /* indigo-500 */
  --color-accent: 16 185 129;  /* emerald-500 */
}
```

### Change Site Name

Search and replace "ShopHub" across the codebase:
- `src/components/layout/Navbar.jsx`
- `src/pages/Home.jsx`
- `package.json` (optional)

### Add New Pages

1. Create component in `src/pages/`
2. Add route in `src/app/router.jsx`:
   ```jsx
   {
     path: "/my-page",
     element: <MyPage />,
   }
   ```
3. Add navigation link in `Navbar.jsx`

---

## 📦 Dependencies

### Core
- **React 19** - UI library
- **React Router 8** - Client-side routing
- **Axios 1.20** - HTTP client
- **Tailwind CSS 4** - Utility-first CSS

### Development
- **Vite 8** - Build tool
- **ESLint** - Code linting
- **@vitejs/plugin-react** - React Fast Refresh

---

## 🤝 Contributing

1. Follow existing code style
2. Use `.jsx` extensions for all React components
3. Include `.js` extensions in all imports
4. Add dark mode support (`dark:` classes) to new components
5. Test on mobile viewports

---

## 📄 License

This project is part of a learning/portfolio project.

---

## 🆘 Troubleshooting

### "Module not found" errors
- Ensure all imports include `.js` or `.jsx` extensions
- Check file paths are correct (case-sensitive on Linux)

### API calls fail with CORS errors
- Verify backend has CORS enabled for your frontend origin
- Check `withCredentials: true` is set in `api.js`

### Theme toggle doesn't persist
- Check browser localStorage is enabled
- Clear cache and reload

### Dark mode not working
- Ensure `<ThemeProvider>` wraps your app in `main.jsx`
- Check Tailwind classes use `dark:` prefix

---

**Built with ❤️ using React + Vite + Tailwind CSS**
