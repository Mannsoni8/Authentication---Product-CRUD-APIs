import { useState } from "react";
import {
  removeFromCart,
  updateCartItem,
} from "../../services/cart.service";

const CartItem = ({ item, onCartUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (quantity) => {
    if (quantity < 1) return;

    try {
      setLoading(true);

      await updateCartItem(item.product._id, quantity);

      onCartUpdate();
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to update cart"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);

      await removeFromCart(item.product._id);

      onCartUpdate();
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to remove item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-5 border-b border-gray-200 py-5">
      <div className="h-24 w-24 shrink-0 rounded-lg bg-gray-100">
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

        <p className="mt-1 text-gray-500">
          ₹{item.product?.price}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            handleQuantityChange(item.quantity - 1)
          }
          disabled={loading || item.quantity === 1}
          className="h-9 w-9 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          -
        </button>

        <span className="w-6 text-center font-medium">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={() =>
            handleQuantityChange(item.quantity + 1)
          }
          disabled={loading}
          className="h-9 w-9 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        disabled={loading}
        className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;