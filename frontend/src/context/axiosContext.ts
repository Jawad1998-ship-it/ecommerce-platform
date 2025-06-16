"use client";

import axios from "axios";
import { useState, useCallback } from "react";
// import { getCookie, setCookie } from "cookies-next/client";

const useAxios = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseURL) {
    console.error(
      "NEXT_PUBLIC_API_BASE_URL is not defined. Please check your .env.local file."
    );
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create an Axios instance
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Ensures cookies are sent with requests
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor to handle 401 errors and refresh token
  axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      const originalRequest = error.config;

      // Check if the error is a 401 and the request hasn't been retried yet
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        error.response?.data?.message !== "No refresh token provided"
      ) {
        originalRequest._retry = true; // Mark the request as retried

        try {
          // Call the refresh-token endpoint
          await axiosInstance.post("/refresh-token");

          // Retry the original request with the new access token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          setError("Failed to refresh token. Please log in again.");
          // Optionally redirect to login page or clear auth state
          // window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // If the error is not a 401 or refresh failed, reject the error
      return Promise.reject(error);
    }
  );

  // Generic fetch function
  const fetchData = useCallback(
    async (method, url, data = null, config = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance({
          method,
          url,
          data,
          ...config,
        });
        return response;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "An unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance]
  );

  // HTTP methods
  const get = useCallback(
    (url, config) => fetchData("GET", url, null, config),
    [fetchData]
  );
  const post = useCallback(
    (url, data, config) => fetchData("POST", url, data, config),
    [fetchData]
  );
  const put = useCallback(
    (url, data, config) => fetchData("PUT", url, data, config),
    [fetchData]
  );
  const del = useCallback(
    (url, config) => fetchData("DELETE", url, null, config),
    [fetchData]
  );

  return { get, post, put, del, loading, error };
};

export default useAxios;
