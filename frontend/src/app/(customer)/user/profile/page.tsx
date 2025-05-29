"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux";
import { setCurrentUser } from "../../../state";
import { useRouter } from "next/navigation";
import useAxios from "@/context/axiosContext";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import Link from "next/link";
import { Edit, Package, Settings, LogOut } from "lucide-react";

const ProfileSection = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { post } = useAxios();
  const user = useAppSelector((state) => state.global.currentUser);
  const [loading, setLoading] = useState(false);

  // Sample user data if not available (replace with actual user data)
  const userInfo = {
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: user?.phone || "(123) 456-7890",
    address: user?.address || "123 Main St, Seattle, WA 98101",
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse = await post("/logout", {});
      if (response.status === 200) {
        toast.success("Logged out successfully", {
          position: "top-right",
          autoClose: 1100,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        router.push("/signin");
        setTimeout(() => {
          dispatch(setCurrentUser(null));
          setLoading(false);
        }, 500);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.data?.error || "An error occurred", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "380px" },
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Your Account</h1>
          <Link
            href="/user/edit-profile"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </Link>
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Personal Information
            </h2>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {userInfo.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {userInfo.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {userInfo.phone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> {userInfo.address}
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Account Actions
            </h2>
            <div className="mt-4 space-y-4">
              <Link
                href="/cart"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Package className="w-5 h-5 mr-2" />
                Your Orders
              </Link>
              <Link
                href="/settings"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Settings className="w-5 h-5 mr-2" />
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {loading ? "Logging out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>

        {/* <div className="border-t pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            More Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/wishlist"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <h3 className="text-sm fontCMS0.0pt;font-medium text-gray-900">
                Your Wish List
              </h3>
              <p className="text-xs text-gray-600">
                View and manage your saved items
              </p>
            </Link>
            <Link
              href="/payment-methods"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <h3 className="text-sm font-medium text-gray-900">
                Payment Methods
              </h3>
              <p className="text-xs text-gray-600">
                Manage your saved payment methods
              </p>
            </Link>
            <Link
              href="/addresses"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <h3 className="text-sm font-medium text-gray-900">Addresses</h3>
              <p className="text-xs text-gray-600">
                Manage your shipping addresses
              </p>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProfileSection;
