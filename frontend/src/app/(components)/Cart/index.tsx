// src/app/(components)/AddToCartSection.tsx
import React from "react";

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
          <select className="border rounded-md p-1 text-gray-800 dark:text-white dark:bg-gray-800">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
        <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition mb-2">
          Add to Cart
        </button>
        <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition mb-2">
          Buy Now
        </button>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Secure transaction
        </p>
        <div className="mt-4">
          <label className="flex items-center text-gray-600 dark:text-gray-300">
            <input type="checkbox" className="mr-2" />
            Add a gift receipt for easy returns
          </label>
        </div>
        <button className="w-full border border-gray-300 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition mt-2">
          Add to List
        </button>
      </div>
    </div>
  );
};

export default AddToCartSection;
