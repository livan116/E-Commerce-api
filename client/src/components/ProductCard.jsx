import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice || product.price * 1.2,
          images: product.images,
          category: product.category,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.error || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group h-[400px] flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative w-full h-52">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-400"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 text-sm font-medium rounded-full shadow-sm">
            {product.category?.name}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[3.5rem]">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mb-4 flex-grow">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${loading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            }`}
        >
          {loading ? (
            <CgSpinner className="animate-spin h-5 w-5" />
          ) : (
            <>
              <BsPlusLg className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
