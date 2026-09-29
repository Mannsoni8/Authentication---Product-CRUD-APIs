import { NavLink } from "react-router";

const ProductCard = ({ product }) => {
  return (
    <NavLink
      to={`/products/${product._id}`}
      className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-xl transition"
    >
      <div className="flex h-56 items-center justify-center bg-gray-100 dark:bg-gray-700">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      <div className="p-5">
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
          {product.category}
        </p>

        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {product.name}
        </h2>

        <p className="text-xl font-bold text-gray-900 dark:text-white">
          ₹{product.price}
        </p>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Stock: {product.stock}
        </p>
      </div>
    </NavLink>
  );
};

export default ProductCard;