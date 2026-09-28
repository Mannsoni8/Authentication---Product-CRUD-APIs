import { useEffect, useState } from "react";
import { getCart } from "../../services/cart.service";
import CartItem from "../../components/cart/CartItem";
import { clearCart } from "../../services/cart.service";
import { useNavigate } from "react-router";

const Cart = () => {
  const navigate = useNavigate();
  const [clearLoading, setClearLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

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
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  const items = cart?.items || [];

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl bg-white px-6 shadow lg:col-span-2">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onCartUpdate={refreshCart}
                />
              ))}
            </div>

            <div className="h-fit rounded-xl bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Cart Summary
              </h2>

              <div className="mb-3 flex justify-between text-gray-600">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="mb-6 flex justify-between border-b pb-5 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>

              <button
                type="button"
                onClick={handleClearCart}
                disabled={clearLoading}
                className="mb-3 w-full rounded-lg border border-red-500 py-3 font-medium text-red-500 hover:bg-red-50 disabled:opacity-50">
                {clearLoading ? "Clearing..." : "Clear Cart"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full rounded-lg bg-black py-3 font-medium text-white hover:bg-gray-800">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
