"use client";

import { useAppDispatch, useAppSelector } from "../../redux";
import { setCurrentUser } from "../../state";
import { Bell, ShoppingCart, User, X } from "lucide-react";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import useAxios from "@/context/axiosContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosResponse } from "axios";
import Image from "next/image";
import Loading from "@/app/loading";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.global.currentUser);
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { post } = useAxios();
  const cartItems = useAppSelector((state) => state.global.cartItems);
  const cartItemsCount = Object?.values(cartItems)?.reduce(
    (total, quantity) => total + quantity,
    0
  );

  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      const response: AxiosResponse = await post("/logout", {});
      if (response.status === 200) {
        toast.success(`Logged out successfully`, {
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

  useEffect((): (() => void) => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <nav
          className={`flex items-center sticky w-full z-20 top-0 px-4 py-2 left-0 h-16 ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-black"
          }`}
        >
          <div className="w-full flex items-center justify-between mx-auto">
            {user?.role === "customer" && (
              <div className="flex items-center justify-center space-x-3 flex-shrink-0 pe-4">
                <Link
                  href="https://flowbite.com/"
                  className="flex items-center space-x-2"
                >
                  <Image
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-8"
                    alt="Flowbite Logo"
                    width={20}
                    height={20}
                  />
                  <span className="self-center text-md font-semibold whitespace-nowrap text-2xl flex-shrink-0">
                    Ecommerce
                  </span>
                </Link>
              </div>
            )}

            {user?.role === "customer" && (
              <div className="flex items-center flex-shrink-0">
                <div className="flex w-auto order-1">
                  <ul className="flex flex-row items-center space-x-4 font-bold">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:border-b-2 hover:border-gray-800 dark:hover:border-gray-300"
                        aria-current="page"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:border-b-2 hover:border-gray-800 dark:hover:border-gray-300"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:border-b-2 hover:border-gray-800 dark:hover:border-gray-300"
                      >
                        Services
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:border-b-2 hover:border-gray-800 dark:hover:border-gray-300"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div
              className={`flex items-center ${
                user?.role !== "customer"
                  ? "w-full justify-between"
                  : "justify-end"
              }  gap-1 flex-shrink-0`}
            >
              {user?.role !== "customer" && (
                <div className="flex items-center gap-5 flex-shrink-0">
                  <div className="relative flex-grow max-w-md flex-shrink-0">
                    <input
                      type="search"
                      placeholder="name or payment id"
                      className="pl-2 py-2 w-[300px] border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500 dark:text-black text-sm md:text-base"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 flex-shrink-0">
                <button className="p-0 border-none bg-transparent outline-none flex-shrink-0">
                  <ThemeSwitcher />
                </button>
                <div className="relative flex-shrink-0">
                  {user?.role === "customer" ? (
                    <Link href="/cart">
                      <ShoppingCart
                        className="cursor-pointer w-6 h-6"
                        size={24}
                      />
                    </Link>
                  ) : (
                    <Bell className="cursor-pointer w-6 h-6" size={24} />
                  )}
                  {user?.role === "customer" ? (
                    <Link href="/cart">
                      <span className="absolute -top-3 -right-3 min-w-[1.25rem] h-5 px-1 text-xs font-semibold text-white bg-red-500 rounded-full flex items-center justify-center leading-none">
                        {user?.role === "customer"
                          ? cartItemsCount > 99
                            ? "99+"
                            : cartItemsCount
                          : 0}
                      </span>
                    </Link>
                  ) : null}
                </div>
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                  {!user ? (
                    <Link href="/signin">
                      <button className="flex items-center cursor-pointer bg-yellow-400 hover:bg-yellow-300 transition duration-100 ease-in-out text-black px-4 py-1">
                        Login
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center cursor-pointer"
                    >
                      <User className="cursor-pointer w-6 h-6" size={24} />
                    </button>
                  )}

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white border rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Settings
                      </Link>
                      <Link
                        href="#"
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
