"use client";

import { useState } from "react";
import { useAppSelector } from "@/app/redux";

export default function SearchBar() {
  const user = useAppSelector((state) => state.global.currentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", { searchQuery, category });
  };

  return (
    <div className="w-full max-w-2xl px-5">
      {user?.role === "customer" ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white rounded-lg shadow-md border border-gray-300"
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-200 text-gray-700 text-sm font-medium rounded-l-lg px-4 py-2.5 focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Kitchen</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Products"
            className="w-full px-4 py-2.5 text-gray-900 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2.5 rounded-r-lg flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white rounded-lg shadow-md border border-gray-300"
        >
          <input
            type="search"
            value={searchQuery} // Bind to state
            onChange={(e) => setSearchQuery(e.target.value)} // Bind to state
            placeholder="Search by name or payment ID"
            className="w-full px-4 py-2.5 text-gray-900 text-sm focus:outline-none rounded-l-lg"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2.5 rounded-r-lg flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
