import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth.js";

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * If user is not authenticated, redirects to login.
 *
 * Usage:
 * <ProtectedRoute element={<Cart />} />
 */
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
