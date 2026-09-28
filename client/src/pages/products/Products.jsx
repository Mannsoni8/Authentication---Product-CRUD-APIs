import { useEffect, useState } from "react";

import { getProducts } from "../../services/product.service";
import ProductCard from "../../components/product/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
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
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Products</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
