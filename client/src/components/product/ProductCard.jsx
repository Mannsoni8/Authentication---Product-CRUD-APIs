import { NavLink } from "react-router";

const ProductCard = ({ product }) => {
  return (
    <NavLink
      to={`/products/${product._id}`}
      className="overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-56 items-center justify-center bg-gray-100">
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
        <p className="mb-1 text-sm text-gray-500">
          {product.category}
        </p>

        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          {product.name}
        </h2>

        <p className="text-xl font-bold text-gray-900">
          ₹{product.price}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Stock: {product.stock}
        </p>
      </div>
    </NavLink>
  );
};

export default ProductCard;