import { useEffect, useState } from "react";
import { getCart } from "../../services/cart.service.js";
import CartItem from "../../components/cart/CartItem.jsx";
import { clearCart } from "../../services/cart.service.js";
import { useNavigate } from "react-router";
import { createOrder } from "../../services/order.service.js";

const Cart = () => {
  const navigate = useNavigate();
  const [clearLoading, setClearLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load cart");
    }
  };

  const handleClearCart = async () => {
    try {
      setClearLoading(true);

      await clearCart();

      await refreshCart();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to clear cart");
    } finally {
      setClearLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setError("");

      const response = await createOrder();

      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        setCart(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading cart...</p>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  const items = cart?.items || [];

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center shadow">
            <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-white dark:bg-gray-800 px-6 shadow lg:col-span-2">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onCartUpdate={refreshCart}
                />
              ))}
            </div>

            <div className="h-fit rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
              <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Cart Summary
              </h2>

              <div className="mb-3 flex justify-between text-gray-600 dark:text-gray-400">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="mb-6 flex justify-between border-b border-gray-200 dark:border-gray-700 pb-5 text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              {error && (
                <div className="mb-3 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleClearCart}
                disabled={clearLoading}
                className="mb-3 w-full rounded-lg border border-red-500 py-3 font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition">
                {clearLoading ? "Clearing..." : "Clear Cart"}
              </button>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full rounded-lg bg-indigo-600 dark:bg-indigo-500 py-3 font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 transition">
                {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
