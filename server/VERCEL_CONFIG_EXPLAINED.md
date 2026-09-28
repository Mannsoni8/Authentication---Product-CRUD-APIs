# Vercel Configuration Explanation

## File: `vercel.json`

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.js"
    }
  ]
}
```

### What This Configuration Does:

#### `"version": 2`
- **WHAT**: Specifies which version of Vercel's platform configuration to use.
- **WHY**: Version 2 is the current stable version that supports serverless functions and modern routing.
- **FOR WHAT**: Ensures compatibility with Vercel's latest features and best practices.

#### `"rewrites"` Array
- **WHAT**: Defines URL routing rules that redirect incoming requests to specific handlers.
- **WHY**: We need to route ALL incoming HTTP requests to our Express app serverless function.
- **FOR WHAT**: This makes your Express routes work seamlessly on Vercel's infrastructure.

#### `"source": "/(.*)"` 
- **WHAT**: A regex pattern that matches ANY incoming URL path.
  - `/` matches the root
  - `(.*)` matches any characters after the root (the entire path)
  - Examples: `/api/auth/login`, `/api/products`, `/api/orders/123`
- **WHY**: Express handles its own routing internally, so we need to forward all requests to it.
- **FOR WHAT**: Ensures that routes like `/api/products`, `/api/auth/login`, etc. are all handled by your Express app.

#### `"destination": "/api/index.js"`
- **WHAT**: The serverless function file that will handle all matched requests.
- **WHY**: Vercel treats files in `/api` as serverless functions, and `/api/index.js` is our Express app export.
- **FOR WHAT**: All incoming requests are passed to your Express app, which then uses its own router to determine which controller handles the request.

### How This Works in Practice:

1. **User sends request**: `GET https://your-backend.vercel.app/api/products`
2. **Vercel receives it** and checks `vercel.json` routing rules
3. **Matches `"source": "/(.*)"` pattern** (because `/api/products` matches `(.*)`)
4. **Forwards to `/api/index.js`** (your Express app)
5. **Express app processes** the request through its middleware chain and routes
6. **Route handler executes**: `getProductsController` responds with product data
7. **Response sent back** to the user

### Alternative Configuration (Not Needed for This Project):

If you wanted more control over function behavior, you could add:

```json
{
  "version": 2,
  "functions": {
    "api/index.js": {
      "maxDuration": 10,
      "memory": 1024
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index.js"
    }
  ]
}
```

- `maxDuration`: Maximum execution time in seconds (default is 10s on free tier)
- `memory`: RAM allocated to the function in MB (default is 1024MB)

**For this project, the simple configuration is sufficient.**
