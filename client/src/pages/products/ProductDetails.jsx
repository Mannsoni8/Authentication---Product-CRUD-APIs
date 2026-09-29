import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProductById } from "../../services/product.service.js";
import { addToCart } from "../../services/cart.service.js";
import useAuth from "../../hooks/useAuth.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      setCartMessage("");

      await addToCart(product._id, quantity);

      setCartMessage("Product added to cart successfully.");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      setCartMessage(
        error.response?.data?.message || "Failed to add product to cart",
      );
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        // Backend returns { message, product }
        setProduct(response.product);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error || "Product not found"}</p>

        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-5 py-2 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
          Back to Products
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/products")}
          className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          ← Back to Products
        </button>

        <div className="grid gap-10 rounded-xl bg-white dark:bg-gray-800 p-6 sm:p-8 shadow md:grid-cols-2">
          <div className="flex min-h-96 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full max-h-[500px] w-full rounded-lg object-cover"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-2 text-sm font-medium uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              {product.category}
            </p>

            <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <p className="mb-6 text-gray-600 dark:text-gray-300">{product.description}</p>

            <p className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString()}
            </p>

            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              {product.stock > 0
                ? `${product.stock} items available`
                : "Out of stock"}
            </p>

            {product.stock > 0 && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-center text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {cartMessage && (
              <div className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                cartMessage.includes("success")
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              }`}>
                {cartMessage}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || cartLoading}
              className="w-full rounded-lg bg-indigo-600 dark:bg-indigo-500 py-3 font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600 transition">
              {cartLoading ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
