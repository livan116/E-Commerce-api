import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CgSpinner, CgTrash } from "react-icons/cg";
import { FaMinus, FaPlus } from "react-icons/fa";

const Cart = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${apiUrl}/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartData(data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.error || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${apiUrl}/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartData(data);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CgSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!cartData?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-48 h-48 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty!</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Shopping Cart ({cartData.summary.totalItems} items)
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                {cartData.items.map((item) => (
                  <div key={item.productId} className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <CgTrash className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            ${item.price}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-gray-500 line-through text-sm">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x bg-gray-50">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100"
                            >
                              <FaPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartData.summary.totalQuantity} items)</span>
                  <span>${cartData.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${cartData.summary.discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total Amount</span>
                    <span>${cartData.summary.total.toFixed(2)}</span>
                  </div>
                </div>
                {cartData.summary.discount > 0 && (
                  <p className="text-green-600 text-sm text-center">
                    You saved ${cartData.summary.discount.toFixed(2)} on this order
                  </p>
                )}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
