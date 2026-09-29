import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getOrders } from "../../services/order.service.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center shadow">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <NavLink
                key={order._id}
                to={`/orders/${order._id}`}
                className="block rounded-xl bg-white dark:bg-gray-800 p-6 shadow hover:shadow-lg transition"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order ID
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Status
                    </p>

                    <p className="font-medium capitalize text-gray-900 dark:text-white">
                      {order.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total
                    </p>

                    <p className="font-bold text-gray-900 dark:text-white">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;