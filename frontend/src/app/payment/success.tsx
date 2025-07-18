import { useRouter } from "next/router";
import {
  useEffect,
  useState,
} from "react";
import { useAppDispatch } from "@/app/redux";
import { clearCart } from "@/app/state";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [
    isProcessing,
    setIsProcessing,
  ] = useState(true);

  useEffect(() => {
    if (
      router.query.status === "VALID"
    ) {
      // Payment successful
      toast.success(
        "Payment successful! Your order has been placed.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        }
      );

      // Clear cart
      dispatch(clearCart());

      // Redirect to orders page or home
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } else {
      // Payment failed
      toast.error(
        "Payment verification failed. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        }
      );

      setTimeout(() => {
        router.push("/checkout");
      }, 2000);
    }

    setIsProcessing(false);
  }, [router.query, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        {isProcessing ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Processing your payment...
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              Payment Processed
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Redirecting you...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
