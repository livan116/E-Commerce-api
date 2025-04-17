import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart after successful checkout
    localStorage.removeItem("cart");
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Success Icon */}
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-green-100">Your order has been successfully placed</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <FaShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Thank You for Shopping!</h2>
                <p className="text-gray-600">
                  We've sent a confirmation email with your order details. Your items will be shipped soon.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Need help? <a href="#" className="text-blue-600 hover:text-blue-700">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
