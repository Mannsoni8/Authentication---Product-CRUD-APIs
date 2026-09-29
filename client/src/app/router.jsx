import { createBrowserRouter } from "react-router";
import Home from "../pages/Home.jsx";
import Layout from "../components/layout/Layout.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Products from "../pages/products/Products.jsx";
import ProductDetails from "../pages/products/ProductDetails.jsx";
import Cart from "../pages/cart/Cart.jsx";
import Orders from "../pages/orders/Orders.jsx";
import OrderDetails from "../pages/orders/OrderDetails.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <ProtectedRoute element={<Cart />} />,
      },
      {
        path: "/orders",
        element: <ProtectedRoute element={<Orders />} />,
      },
      {
        path: "/orders/:id",
        element: <ProtectedRoute element={<OrderDetails />} />,
      },
    ],
  },
]);

export default router;
