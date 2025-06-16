"use client";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { addToCart, removeFromCart } from "@/app/state";
import { Plus, Minus } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Fashion Bags",
    price: 59.99,
    image: "/images/bags.jpg",
  },
  {
    id: 2,
    name: "Stylish Glasses",
    price: 29.99,
    image: "/images/glasses.jpg",
  },
  {
    id: 3,
    name: "Jackets",
    price: 89.99,
    image: "/images/jackets.jpg",
  },
  {
    id: 4,
    name: "Jeans",
    price: 49.99,
    image: "/images/jeans.jpg",
  },
  {
    id: 5,
    name: "Shoes",
    price: 69.99,
    image: "/images/shoes.jpg",
  },
  {
    id: 6,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 7,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 8,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 9,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 10,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 11,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 12,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 13,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 14,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 15,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
  {
    id: 16,
    name: "Suits",
    price: 199.99,
    image: "/images/suits.jpg",
  },
];

const Home = () => {
  const { theme } = useTheme();
  const [animationTrigger, setAnimationTrigger] = useState<{
    [key: number]: "add" | "remove" | null;
  }>({});
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.global.cartItems);
  const handleAddToCart = (productId: number) => {
    setAnimationTrigger((prev) => ({ ...prev, [productId]: "add" }));
    dispatch(addToCart(productId));
    setTimeout(() => {
      setAnimationTrigger((prev) => ({ ...prev, [productId]: null }));
    }, 500);
  };

  const handleRemoveFromCart = (productId: number) => {
    setAnimationTrigger((prev) => ({ ...prev, [productId]: "remove" }));
    dispatch(removeFromCart(productId));
    setTimeout(() => {
      setAnimationTrigger((prev) => ({ ...prev, [productId]: null }));
    }, 500);
  };

  const formatCartQuantity = (quantity: number) => {
    return quantity > 999 ? "999+" : quantity;
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <main className="mainContainer mx-auto pt-10 pb-6 sm:pt-15 sm:pb-8">
        <section className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-full text-center md:w-1/2 p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Welcome to E-Commerce
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
                Discover the best deals on fashion, accessories, and more. Shop
                now and enjoy exclusive offers!
              </p>
              <Link
                href="/products"
                className="inline-block bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-blue-600 transition text-sm sm:text-base"
              >
                Shop Now
              </Link>
            </div>
            <div className="w-full md:w-1/2">
              <Image
                src="/images/banner.png"
                alt="Hero Banner"
                width={600}
                height={400}
                priority
                className="object-contain w-full h-48 sm:h-64 md:h-80 lg:h-96"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
            Featured Products
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products?.map((product) => (
              <Link
                href={`/products/${product?.name?.toLowerCase()}/dp/${
                  product?.id
                }`}
                key={product?.id}
              >
                <div className="bg-white dark:bg-gray-800 border border-b-gray-500 rounded-lg hover:shadow-gray-400 shadow-lg overflow-hidden hover:shadow-xl transition">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    width={300}
                    height={300}
                    priority
                    className="object-cover w-full h-36 sm:h-48 lg:h-64"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {product?.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                      ${product?.price?.toFixed(2)}
                    </p>
                    {cartItems[product?.id] ? (
                      <div className="flex items-center justify-between px-1 border rounded-lg overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFromCart(product?.id);
                          }}
                          className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-3 sm:px-4 py-1 sm:py-2 font-medium transition hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          <Minus size={16} strokeWidth={2} />
                        </button>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${product?.id}-${cartItems[product?.id]}`}
                            initial={
                              animationTrigger[product?.id] === "add"
                                ? { y: -20, opacity: 0 }
                                : animationTrigger[product?.id] === "remove"
                                ? { y: 20, opacity: 0 }
                                : { y: 0, opacity: 1 }
                            }
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-gray-800 dark:text-white"
                          >
                            {formatCartQuantity(cartItems[product?.id])}
                          </motion.span>
                        </AnimatePresence>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product?.id);
                          }}
                          className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-3 sm:px-4 py-1 sm:py-2 font-medium transition hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          <Plus size={16} strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product?.id);
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition text-sm sm:text-base"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
