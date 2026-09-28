import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getOrders } from "../../services/order.service";

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
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
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

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <NavLink
                key={order._id}
                to={`/orders/${order._id}`}
                className="block rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="font-medium text-gray-900">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Status
                    </p>

                    <p className="font-medium capitalize text-gray-900">
                      {order.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="font-bold text-gray-900">
                      ₹{order.totalAmount}
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