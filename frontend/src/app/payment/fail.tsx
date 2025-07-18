import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function PaymentFail() {
  const router = useRouter();

  useEffect(() => {
    toast.error(
      "Payment failed. Please try again.",
      {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      }
    );

    setTimeout(() => {
      router.push("/checkout");
    }, 3000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your payment could not be
          processed. Redirecting you
          back to checkout...
        </p>
      </div>
    </div>
  );
}
