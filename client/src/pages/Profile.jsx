import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaCalendarAlt, FaLock, FaShoppingBag, FaCog, FaSignOutAlt } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [orders, setOrders] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const { data } = await axios.get(`${apiUrl}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <CgSpinner className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                        <FaUser className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{user.name || user.email}</h2>
                                        <p className="text-blue-100 text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <FaUser className="w-5 h-5" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === "orders" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <FaShoppingBag className="w-5 h-5" />
                                    <span>Orders</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <FaCog className="w-5 h-5" />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <FaSignOutAlt className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === "profile" && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FaUser className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                            <p className="text-gray-900">{user.name || "Not set"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FaEnvelope className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                                            <p className="text-gray-900">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                                        </div>
                                        
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FaLock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Account Security</h3>
                                            <p className="text-gray-900">Password protected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                                </div>
                                <div className="p-6">
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FaShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                                            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                                            <button
                                                onClick={() => navigate("/")}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Order items will be mapped here */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900">Update Profile</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 