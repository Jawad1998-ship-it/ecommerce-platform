"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

// Product data (same as provided)
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
    name: "Watches",
    price: 149.99,
    image: "/images/suits.jpg",
  },
  {
    id: 8,
    name: "Hats",
    price: 24.99,
    image: "/images/suits.jpg",
  },
  {
    id: 9,
    name: "T-shirts",
    price: 19.99,
    image: "/images/suits.jpg",
  },
  {
    id: 10,
    name: "Belts",
    price: 29.99,
    image: "/images/suits.jpg",
  },
  {
    id: 11,
    name: "Socks",
    price: 9.99,
    image: "/images/suits.jpg",
  },
  {
    id: 12,
    name: "Scarves",
    price: 19.99,
    image: "/images/suits.jpg",
  },
  {
    id: 13,
    name: "Gloves",
    price: 14.99,
    image: "/images/suits.jpg",
  },
  {
    id: 14,
    name: "Swimwear",
    price: 34.99,
    image: "/images/suits.jpg",
  },
  {
    id: 15,
    name: "Sweaters",
    price: 49.99,
    image: "/images/suits.jpg",
  },
  {
    id: 16,
    name: "Coats",
    price: 129.99,
    image: "/images/suits.jpg",
  },
];

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { theme } = useTheme();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div
      className={`${theme} flex items-center border-b py-4 rounded-lg mb-4 shadow-sm`}
    >
      <Image
        src={item.image}
        alt={item.name}
        width={120}
        height={120}
        className="object-cover rounded"
      />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-700">
            Qty:
          </label>
          <select
            id={`quantity-${item.id}`}
            value={item.quantity}
            onChange={handleQuantityChange}
            className="border rounded p-1 bg-white text-gray-800"
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-4 text-red-500 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
      <p className="font-semibold text-gray-800">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  );
};

const CartPage = () => {
  const { theme } = useTheme();

  // Mock cart items (replace with Redux or other state management)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Fashion Bags",
      price: 59.99,
      image: "/images/bags.jpg",
      quantity: 2,
    },
    {
      id: 5,
      name: "Shoes",
      price: 69.99,
      image: "/images/shoes.jpg",
      quantity: 1,
    },
  ]);

  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={`${theme} min-h-screen`}>
      <main className="mainContainer mx-auto py-8 px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-500 hover:text-blue-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <div className="lg:w-1/3 bg-gradient-to-b from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-2 rounded-lg transition-colors"
                onClick={() => alert("Proceeding to checkout...")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
