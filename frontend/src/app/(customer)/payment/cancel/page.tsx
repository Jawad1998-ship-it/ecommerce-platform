"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PaymentCancelPage = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-yellow-500 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Your transaction ID is:{" "}
          <span className="font-semibold">{transactionId}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Your payment has been cancelled. You can go back to the order
          page to try again.
        </p>
        <Link
          className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          href="/order-details"
        >
          Go to Order Page
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
