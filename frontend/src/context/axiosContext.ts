"use client";

import axios from "axios";
import { useState, useCallback } from "react";
// import { getCookie } from "cookies-next/client";

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
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      // authorization: `Bearer ${getCookie("token")}`,
    },
  });

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
          err.response?.data?.data?.error || "An unknown error occurred";
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
