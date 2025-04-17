import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ user, setUser, selectedCategory, setSelectedCategory }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const categories = [
    "All",
    "Clothes",
    "Electronics",
    "Furniture",
    "Shoes",
    "Toys",
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateCartCount = async () => {
      const token = localStorage.getItem("token");
      if (token && user) {
        try {
          const { data } = await axios.get(`${apiUrl}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartCount(data.summary?.totalQuantity || 0);
        } catch (error) {
          console.error("Error updating cart count:", error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    // Listen for storage changes
    window.addEventListener("storage", updateCartCount);

    // Custom event for cart updates
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setUser(null);
    navigate("/");
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Categories */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-black no-underline overflow-hidden"
            >
              E-Commerce
            </Link>

            {/* Desktop Categories */}
            <div className="hidden md:flex space-x-4 ml-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    navigate("/");
                  }}
                  className={`${selectedCategory === category
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500"
                    } hover:text-black transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <span className="hidden md:inline text-gray-600">{user.email}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaUser className="mr-2" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaCog className="mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to="/cart"
                  onClick={handleCartClick}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                  <FaShoppingCart className="h-6 w-6" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-black">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-600 hover:text-black">
                  Signup
                </Link>
                <Link
                  to="/login"
                  onClick={handleCartClick}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaShoppingCart className="h-6 w-6" />
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Categories Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed left-0 right-0 top-16 bg-white shadow-md py-4 z-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsMobileMenuOpen(false);
                      navigate("/");
                    }}
                    className={`text-left px-4 py-2 ${selectedCategory === category
                        ? "bg-gray-100 text-black"
                        : "text-gray-500"
                      } hover:bg-gray-100 transition-colors`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
