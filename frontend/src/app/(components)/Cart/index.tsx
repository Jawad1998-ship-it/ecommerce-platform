"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { addToCart, removeFromCart } from "@/app/state";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  brand: string;
  color: string;
  material: string;
  compatibleDevices: string;
  screenSize: string;
  dimensions: string;
  batteryLife: string;
  sensorType: string;
  batteryDescription: string;
  features: string[];
}

interface AddToCartSectionProps {
  product: Product;
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.global.cartItems);
  const [animationTrigger, setAnimationTrigger] = useState<
    "add" | "remove" | null
  >(null);

  const handleAddToCart = () => {
    setAnimationTrigger("add");
    dispatch(addToCart(product.id));
    setTimeout(() => setAnimationTrigger(null), 500);
  };

  const handleRemoveFromCart = () => {
    setAnimationTrigger("remove");
    dispatch(removeFromCart(product.id));
    setTimeout(() => setAnimationTrigger(null), 500);
  };

  const formatCartQuantity = (quantity: number) => {
    return quantity > 999 ? "999+" : quantity;
  };

  return (
    <div className="w-1/3">
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md sticky top-4">
        <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          List Price: ${product.originalPrice.toFixed(2)}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          $1.24 Shipping & Import Fees Deposit to Bangladesh
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Delivery Thursday, April 17. Order within 10 hrs 58 mins
        </p>
        <p className="text-green-600 dark:text-green-400 mb-4">In Stock</p>
        <div className="flex items-center mb-4">
          <label className="mr-2 text-gray-600 dark:text-gray-300">
            Quantity:
          </label>
          {cartItems[product.id] ? (
            <div className="flex items-center justify-between border rounded-lg overflow-hidden">
              <button
                onClick={handleRemoveFromCart}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 font-medium transition hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                <Minus size={16} strokeWidth={2} />
              </button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${product.id}-${cartItems[product.id]}`}
                  initial={
                    animationTrigger === "add"
                      ? { y: -20, opacity: 0 }
                      : animationTrigger === "remove"
                      ? { y: 20, opacity: 0 }
                      : { y: 0, opacity: 1 }
                  }
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-3 py-1 text-sm text-gray-800 dark:text-white"
                >
                  {formatCartQuantity(cartItems[product.id])}
                </motion.span>
              </AnimatePresence>
              <button
                onClick={handleAddToCart}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 font-medium transition hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                <Plus size={16} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <select className="border rounded-md p-1 text-gray-800 dark:text-white dark:bg-gray-800">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          )}
        </div>
        {!cartItems[product.id] && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition mb-2"
          >
            Add to Cart
          </button>
        )}
        <Link href="/cart">
          <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition mb-2">
            Buy Now
          </button>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Secure transaction
        </p>
        {/* <div className="mt-4">
          <label className="flex items-center text-gray-600 dark:text-gray-300">
            <input type="checkbox" className="mr-2" />
            Add a gift receipt for easy returns
          </label>
        </div>
        <button className="w-full border border-gray-300 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition mt-2">
          Add to List
        </button> */}
      </div>
    </div>
  );
};

export default AddToCartSection;
