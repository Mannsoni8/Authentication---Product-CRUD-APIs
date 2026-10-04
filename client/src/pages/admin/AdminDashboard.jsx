import { NavLink } from "react-router";

const AdminDashboard = () => {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            Admin Panel
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your store products and orders.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <NavLink
            to="/admin/products"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Manage Products
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create, update and delete products.
            </p>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5h6"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              Manage Orders
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View orders and update their status.
            </p>
          </NavLink>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;