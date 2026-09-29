import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  cancelOrder,
  getOrderById,
} from "../../services/order.service.js";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(id);
      setOrder(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    try {
      setCancelLoading(true);
      setError("");

      await cancelOrder(id);
      await fetchOrder();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to cancel order"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading order...</p>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>

        <button
          onClick={() => navigate("/orders")}
          className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-5 py-2 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
        >
          Back to Orders
        </button>
      </main>
    );
  }

  const canCancel =
    order.status === "pending" ||
    order.status === "confirmed";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            ← Back to Orders
          </button>
        </div>

        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6 sm:flex-row">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order ID
              </p>

              <p className="font-semibold text-gray-900 dark:text-white">
                {order._id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status
              </p>

              <p className="font-semibold capitalize text-gray-900 dark:text-white">
                {order.status}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {order.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-5"
              >
                <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {item.product?.name}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-medium text-gray-900 dark:text-white">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-6 text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelLoading}
              className="mt-6 w-full rounded-lg border border-red-500 py-3 font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition"
            >
              {cancelLoading
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;