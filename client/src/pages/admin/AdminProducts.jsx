import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/product.service";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();

      setProducts(response.products || response.data?.products || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product._id !== id));

      setMessage("Product deleted successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Products
            </h1>

            <p className="mt-1 text-gray-500">
              Add, edit and manage your store products.
            </p>
          </div>

          <button className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700">
            Add Product
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">
            {message}
          </div>
        )}

        {/* Products */}
        {products.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {product._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{product.price}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.stock}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
