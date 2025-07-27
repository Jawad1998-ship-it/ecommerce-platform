"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useAxios from "@/context/axiosContext";
import Image from "next/image";

interface TryItOnProps {
  product: any;
  onClose: () => void;
}

const TryItOn: React.FC<
  TryItOnProps
> = ({ product, onClose }) => {
  const [height, setHeight] =
    useState("");
  const [weight, setWeight] =
    useState("");
  const [userImage, setUserImage] =
    useState(null);
  const [
    generatedImage,
    setGeneratedImage,
  ] = useState(null);
  const { post, loading } = useAxios();

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.files &&
      e.target.files[0]
    ) {
      setUserImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!userImage) {
      toast.error(
        "Please upload an image."
      );
      return;
    }

    const formData = new FormData();
    formData.append("height", height);
    formData.append("weight", weight);
    formData.append(
      "userImage",
      userImage
    );
    formData.append(
      "productImage",
      product.imageUrls[0]
    ); // or whichever image is appropriate

    try {
      const response = await post(
        "/products/try-it-on",
        formData
      );
      if (response.status === 200) {
        setGeneratedImage(
          response.data.imageUrl
        );
        toast.success(
          "Check out your new look!"
        );
      } else {
        throw new Error(
          "Failed to generate image."
        );
      }
    } catch (error) {
      console.error(
        "Error generating image:",
        error
      );
      toast.error(
        "Failed to generate image. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Try It On
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Height (cm)
            </label>
            <input
              type="text"
              id="height"
              value={height}
              onChange={(e) =>
                setHeight(
                  e.target.value
                )
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Weight (kg)
            </label>
            <input
              type="text"
              id="weight"
              value={weight}
              onChange={(e) =>
                setWeight(
                  e.target.value
                )
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="userImage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Upload Your Photo
            </label>
            <input
              type="file"
              id="userImage"
              onChange={
                handleImageChange
              }
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading
                ? "Generating..."
                : "Generate Image"}
            </button>
          </div>
        </form>
        {generatedImage && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">
              Your New Look:
            </h3>
            <Image
              width={100}
              height={100}
              src={generatedImage}
              alt="Generated model"
              className="w-full rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TryItOn;
