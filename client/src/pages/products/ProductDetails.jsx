import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProductById } from "../../services/product.service";
import { addToCart } from "../../services/cart.service";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    try {
      setCartLoading(true);
      setCartMessage("");

      await addToCart(product._id, quantity);

      setCartMessage("Product added to cart successfully.");
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
        setProduct(response.data);
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
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>

        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800">
          Back to Products
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-100 px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-xl bg-white p-8 shadow md:grid-cols-2">
        <div className="flex min-h-96 items-center justify-center rounded-lg bg-gray-100">
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
          <p className="mb-2 text-sm font-medium uppercase text-gray-500">
            {product.category}
          </p>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mb-6 text-gray-600">{product.description}</p>

          <p className="mb-4 text-3xl font-bold text-gray-900">
            ₹{product.price}
          </p>

          <p className="mb-6 text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

          <button
            disabled={product.stock === 0}
            className="w-full rounded-lg bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
