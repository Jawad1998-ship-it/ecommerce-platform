"use client";
import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import Loading from "@/utils/LoadingProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoadingChange = (loading: boolean) => {
    console.log("Register handleLoadingChange, loading:", loading);
    setIsLoading(loading);
  };

  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex flex-col flex-wrap h-screen items-center justify-center">
          <div className="w-full flex flex-col items-center text-center p-2">
            <h1 className="text-4xl font-bold text-blue-800">PayGuard</h1>
            <p className="text-gray-700 text-md font-medium">
              Your trusted platform for secure payments.
            </p>
          </div>
          <div className="w-[400px] mb-3">
            <div className="bg-white shadow-lg rounded-xl p-4 space-y-3 mx-auto border border-gray-300">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Sign Up
              </h2>

              <SignUpForm onLoadingChange={handleLoadingChange} />

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-blue-600 font-medium hover:underline transition duration-200"
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
