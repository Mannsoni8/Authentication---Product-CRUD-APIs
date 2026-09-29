import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getProducts } from "../services/product.service.js";


const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 6 });
        setFeaturedProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center">
            {/* Hero Text */}
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                Discover Quality Furniture for Your Space
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Explore our curated collection of modern, stylish, and affordable furniture pieces. Transform your home with our premium selection.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/products"
                  className="rounded-lg bg-white dark:bg-gray-800 px-8 py-3 font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products"
                  className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 aspect-square flex items-center justify-center">
                <svg
                  className="w-48 h-48 text-white opacity-30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-4h2v18h-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ShopHub?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We provide the best shopping experience with quality products and excellent service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🚚",
                title: "Fast Delivery",
                description: "Get your furniture delivered quickly to your doorstep",
              },
              {
                icon: "💯",
                title: "Quality Products",
                description: "All our items are carefully selected for durability",
              },
              {
                icon: "🔒",
                title: "Secure Payment",
                description: "Your transactions are safe and encrypted",
              },
              {
                icon: "🤝",
                title: "24/7 Support",
                description: "We're here to help you anytime, anywhere",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-gray-700 p-6 text-center hover:shadow-lg dark:hover:shadow-xl transition"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-white dark:bg-gray-900 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Check out our latest and most popular furniture
              </p>
            </div>
            <Link
              to="/products"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline hidden sm:block"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No products available yet
              </p>
              <Link
                to="/products"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Explore all products →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow hover:shadow-xl transition"
                >
                  <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <svg
                        className="h-20 w-20 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                      {product.category}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                        <svg
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center sm:hidden">
            <Link
              to="/products"
              className="inline-block rounded-lg bg-indigo-600 dark:bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 dark:bg-indigo-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Explore our complete collection of furniture and find the perfect pieces for your home
          </p>
          <Link
            to="/products"
            className="inline-block rounded-lg bg-white dark:bg-gray-800 px-8 py-4 font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
