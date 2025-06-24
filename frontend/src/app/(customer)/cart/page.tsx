"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { addToCart, removeFromCart, clearCartItem } from "@/app/state";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

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

const CartItem = ({ item, onUpdateQuantity }) => {
  const dispatch = useAppDispatch();
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1) {
      onUpdateQuantity(item?.id, newQuantity);
    }
  };

  const handleAdd = () => {
    dispatch(addToCart(item?.id));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item?.id));
  };

  return (
    <div
      className={`bg-gradient-to-b from-blue-50 to-purple-50 border-2 px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center rounded-lg mb-4 shadow-sm w-full`}
    >
      <Link href={`/products/${item?.name?.toLowerCase()}/dp/${item?.id}`}>
        <Image
          src={item?.image}
          alt={item?.name}
          width={100}
          height={100}
          className="object-cover rounded w-24 h-24 sm:w-32 sm:h-32"
        />
      </Link>
      <div className="flex-1 mt-3 sm:mt-0 sm:ml-4 w-full">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          {item?.name}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">
          ${item?.price?.toFixed(2)}
        </p>
        <div className="flex items-center mt-2 gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRemove}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 h-10 rounded-l text-sm sm:text-base transition-colors"
            >
              <Minus size={16} strokeWidth={2} />
            </button>
            <span
              onChange={handleQuantityChange}
              className="text-black border rounded px-2 py-2 h-10 w-16 text-center text-sm sm:text-base 
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:appearance-none outline-none"
            >
              {item?.quantity}
            </span>
            <button
              onClick={handleAdd}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 h-10 rounded-r text-sm sm:text-base transition-colors"
            >
              <Plus size={16} strokeWidth={2} />
            </button>
          </div>
          <button
            onClick={() => dispatch(clearCartItem(item?.id))}
            className="text-red-500 hover:text-red-600 transition-colors text-sm sm:text-base px-4 py-2 border-l border-gray-300 ml-4"
          >
            Remove
          </button>
        </div>
      </div>
      <p className="font-semibold text-gray-800 text-sm sm:text-base mt-2 sm:mt-0">
        ${(item?.price * item?.quantity)?.toFixed(2)}
      </p>
    </div>
  );
};

const CartPage = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const cartItemsFromStore = useAppSelector((state) => state.global.cartItems);

  // Convert Redux cartItems object to array with product details
  const cartItems = Object?.entries(cartItemsFromStore)
    ?.map(([id, quantity]) => {
      const product = products?.find((p) => p?.id === parseInt(id));
      return product ? { ...product, quantity } : null;
    })
    .filter((item) => item !== null);

  const updateQuantity = (id, quantity) => {
    if (quantity > cartItemsFromStore[id]) {
      for (let i = cartItemsFromStore[id]; i < quantity; i++) {
        dispatch(addToCart(id));
      }
    } else {
      for (let i = cartItemsFromStore[id]; i > quantity; i--) {
        dispatch(removeFromCart(id));
      }
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item?.price * item?.quantity,
    0
  );

  return (
    <div className={`${theme} min-h-screen flex flex-col`}>
      <main className="mainContainer mx-auto max-w-7xl w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 border-b-2 border-gray-300 pb-1 w-full">
          Shopping Cart
        </h1>
        {cartItems?.length === 0 ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <p className="text-gray-600 text-sm sm:text-base">
              Your cart is empty.
            </p>
            <Link
              href="/home"
              className="mt-3 sm:mt-4 inline-block text-blue-500 hover:text-blue-600 transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="bg-white flex-1 p-4 sm:p-6 rounded-lg shadow-lg">
              {cartItems?.map((item) => (
                <CartItem
                  key={item?.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
            <div className="h-full sticky top-20 lg:w-80 xl:w-96 bg-gradient-to-b from-blue-50 to-purple-50 p-4 sm:p-6 rounded-lg shadow-lg w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                <span>Subtotal ({cartItems?.length} items)</span>
                <span>${subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 text-sm sm:text-base">
                <span>Total</span>
                <span>${subtotal?.toFixed(2)}</span>
              </div>
              <Link href="/order-details">
                <button className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
