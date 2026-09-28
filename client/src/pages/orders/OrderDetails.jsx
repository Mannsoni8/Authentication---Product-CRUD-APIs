import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  cancelOrder,
  getOrderById,
} from "../../services/order.service";

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
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>

        <button
          onClick={() => navigate("/orders")}
          className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
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
    <main className="min-h-[calc(100vh-64px)] bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-gray-600 hover:text-black"
          >
            ← Back to Orders
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row">
            <div>
              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <p className="font-semibold text-gray-900">
                {order._id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="font-semibold capitalize text-gray-900">
                {order.status}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {order.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 border-b border-gray-200 pb-5"
              >
                <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">
                    {item.product?.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-medium text-gray-900">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t pt-6 text-lg font-bold">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
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
              className="mt-6 w-full rounded-lg border border-red-500 py-3 font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
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