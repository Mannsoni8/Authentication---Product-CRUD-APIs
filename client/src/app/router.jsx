import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Products from "../pages/products/Products";
import Cart from "../pages/cart/Cart";
import Orders from "../pages/orders/Orders";
import OrderDetails from "../pages/orders/OrderDetails";

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
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/:id",
        element: <OrderDetails />,
      },
    ],
  },
]);

export default router;
