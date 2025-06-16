"use client";

import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NextRouter } from "next/router";
import ProductImageUpload from "../../(dashboard)/business/products/ProductImageUpload";
import { toast } from "react-toastify";
import useAxios from "@/context/axiosContext";

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number | string;
  originalPrice?: number | string;
  brand: string;
  color: string;
  material: string;
  compatibleDevices: string;
  screenSize: string;
  dimensions: string;
  batteryLife?: string;
  sensorType?: string;
  batteryDescription?: string;
  features: string[];
  imageFiles: { file: File }[];
  isInStock: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  originalPrice: Yup.number()
    .positive("Original price must be positive")
    .moreThan(
      Yup.ref("price"),
      "Original price must be greater than current price"
    )
    .nullable(),
  brand: Yup.string().required("Brand is required"),
  color: Yup.string().required("Color is required"),
  material: Yup.string().required("Material is required"),
  compatibleDevices: Yup.string().required("Compatible devices are required"),
  screenSize: Yup.string().required("Screen size is required"),
  dimensions: Yup.string().required("Dimensions are required"),
  batteryLife: Yup.string().nullable(),
  sensorType: Yup.string().nullable(),
  batteryDescription: Yup.string().nullable(),
  features: Yup.array()
    .of(Yup.string().required("Feature cannot be empty"))
    .min(1, "At least one feature is required"),
  imageFiles: Yup.array()
    .of(
      Yup.object().shape({
        file: Yup.mixed().required("Image file is required"),
      })
    )
    .min(1, "At least one image is required"),
  isInStock: Yup.boolean().required("Stock status is required"),
});

interface AddProductFormProps {
  theme: string;
  router: NextRouter;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ theme, router }) => {
  const { post, loading } = useAxios();

  const initialValues: ProductFormData = {
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    brand: "",
    color: "",
    material: "",
    compatibleDevices: "",
    screenSize: "",
    dimensions: "",
    batteryLife: "",
    sensorType: "",
    batteryDescription: "",
    features: [""],
    imageFiles: [],
    isInStock: true,
  };

  // Upload single file with progress
  const uploadSingleFile = async (
    file: File
  ): Promise<{ url: string; publicId: string } | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/db3dox65k/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleSubmit = async (
    values: ProductFormData,
    { setSubmitting }: any
  ) => {
    try {
      if (!values.imageFiles || values.imageFiles.length === 0) {
        toast.error("Please upload at least one product image", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      // Upload images
      const uploadPromises = values.imageFiles.map(async (image) => {
        return await uploadSingleFile(image.file);
      });

      const results = await Promise.allSettled(uploadPromises);
      const uploadedImages = results
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<{
            url: string;
            publicId: string;
          }> => result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);

      if (uploadedImages.length === 0) {
        toast.error("Failed to upload images", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      const productData = {
        ...values,
        imageFiles: uploadedImages,
      };

      const response = await post("/products/create", productData);

      if (response?.status === 201) {
        toast.success("Product Created Successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Redirect to products list after successful creation
        // setTimeout(() => {
        //   router.push("/products");
        // }, 2000);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error?.response?.data?.data?.error ||
        error?.response?.data?.message ||
        "An error occurred during product creation";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "500px" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form className={`space-y-6 ${theme} p-4 rounded-lg shadow-lg`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Product Name <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Enter product name"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Price <span className="text-red-500">*</span>
              </label>
              <Field
                type="number"
                name="price"
                step="0.01"
                placeholder="Enter price"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="price"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="originalPrice"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Original Price (Optional)
              </label>
              <Field
                type="number"
                name="originalPrice"
                step="0.01"
                placeholder="Enter original price"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="originalPrice"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="brand"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Brand <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="brand"
                placeholder="Enter brand"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="brand"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="color"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Color <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="color"
                placeholder="Enter color"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="color"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="material"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Material <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="material"
                placeholder="Enter material"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="material"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="compatibleDevices"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Compatible Devices <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="compatibleDevices"
                placeholder="Enter compatible devices"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="compatibleDevices"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="screenSize"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Screen Size <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="screenSize"
                placeholder="Enter screen size"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="screenSize"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="dimensions"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Dimensions <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="dimensions"
                placeholder="Enter dimensions"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="dimensions"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="batteryLife"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Battery Life (Optional)
              </label>
              <Field
                type="text"
                name="batteryLife"
                placeholder="Enter battery life"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="batteryLife"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="sensorType"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Sensor Type (Optional)
              </label>
              <Field
                type="text"
                name="sensorType"
                placeholder="Enter sensor type"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="sensorType"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="batteryDescription"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
              >
                Battery Description (Optional)
              </label>
              <Field
                type="text"
                name="batteryDescription"
                placeholder="Enter battery description"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
              />
              <ErrorMessage
                name="batteryDescription"
                component="p"
                className="text-red-500 text-xs mt-1"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <Field
              as="textarea"
              name="description"
              rows={4}
              placeholder="Enter product description"
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
            />
            <ErrorMessage
              name="description"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
              Features <span className="text-red-500">*</span>
            </label>
            <FieldArray name="features">
              {({ push, remove }) => (
                <div className="space-y-2">
                  {values.features.map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Field
                        name={`features[${index}]`}
                        placeholder={`Enter feature ${index + 1}`}
                        className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                      />
                      {values.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push("")}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Add Feature
                  </button>
                  <ErrorMessage
                    name="features"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              )}
            </FieldArray>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
              Product Images <span className="text-red-500">*</span>
            </label>
            <ProductImageUpload
              onChange={(imageData) => setFieldValue("imageFiles", imageData)}
              value={values.imageFiles}
              maxFiles={10}
              maxFileSize={5}
            />
            <ErrorMessage
              name="imageFiles"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
            {values.imageFiles.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {values.imageFiles.length} image(s) selected
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Field
              type="checkbox"
              name="isInStock"
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <label
              htmlFor="isInStock"
              className="text-gray-700 dark:text-gray-300 font-medium text-sm"
            >
              In Stock
            </label>
            <ErrorMessage
              name="isInStock"
              component="p"
              className="text-red-500 text-xs"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Product...</span>
                </>
              ) : (
                <span>Add Product</span>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddProductForm;
