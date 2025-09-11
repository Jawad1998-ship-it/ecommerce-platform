"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { EditIcon } from "@/app/(components)/Icons/Icons";
import { Product, Category } from "@/types/types";
import useAxios from "@/context/axiosContext";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import Image from "next/image";

const columnHelper = createColumnHelper();

const ProductsPage = () => {
  const { get } = useAxios();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Product Name",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <Image
              src={info?.row?.original?.imageUrls[0] || "/images/placeholder.jpg"}
              alt={info?.row?.original?.name}
              width={60}
              height={60}
              priority
              className="object-cover rounded-md"
            />
            <span className="font-medium">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("brand", {
        header: "Brand",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.category?.name, {
        id: "category",
        header: "Category",
        cell: (info) => {
          console.log(info);
          return <div>{info.getValue() || "N/A"}</div>;
        },
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
      }),
      columnHelper.accessor("isInStock", {
        header: "In Stock",
        cell: (info) => (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              info.getValue()
                ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
            }`}
          >
            {info.getValue() ? "Yes" : "No"}
          </span>
        ),
      }),
      columnHelper.accessor("_id", {
        header: "Actions",
        cell: (info) => (
          <button
            onClick={() => router.push(`/business/products/edit/${info.getValue()}`)}
            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1 rounded hover:bg-indigo-100 dark:hover:bg-gray-700"
            title="Edit Product"
          >
            <EditIcon />
          </button>
        ),
      }),
    ],
    [router]
  );

  const fetchProducts = async () => {
    try {
      const response = await get(`/products/all-products`);
      setProducts(response?.data?.data?.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await get(`/categories/all-categories`);
      setCategories(response?.data?.data?.categories);
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return products;
    }
    return products.filter((product) => (product.category as Category)?._id === selectedCategory);
  }, [products, selectedCategory]);

  const table = useReactTable({
    data: filteredProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAddProduct = () => {
    router.push("/business/products/add");
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Manage Products</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-colors"
          >
            Add New Product
          </button>
        </div>
      </div>

      {filteredProducts?.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No products</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedCategory ? "No products found in this category." : "Get started by creating a new product."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
