"use client";

import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useAxios from "@/context/axiosContext";
import { useTheme } from "next-themes";
import AddCategoryForm from "@/app/(components)/CategoryForm/AddCategoryForm";

const CategoryAdminComponent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`${
        theme === "light"
          ? "bg-gradient-to-br from-gray-100 to-gray-200"
          : "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      } transition-colors duration-300 flex items-center justify-center p-4`}
    >
      <div className="container mx-auto max-w-full">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            Add Product Category
          </h1>
        </div>
        <AddCategoryForm theme={theme} />
      </div>
    </div>
  );
};

export default CategoryAdminComponent;
