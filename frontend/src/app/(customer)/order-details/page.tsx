"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CreditCard, Lock } from "lucide-react";
import useAxios from "@/context/axiosContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAppSelector } from "@/app/redux";

const checkoutValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  address: Yup.string().required("Street address is required"),
  city: Yup.string().required("Town / City is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  orderNotes: Yup.string(),
  paymentMethod: Yup.string().required("Please select a payment method"),
});

const OrderDetails = () => {
  const router = useRouter();
  const { post } = useAxios();
  const { theme } = useTheme();
  const [orders, setOrders] = useState();
  const user = null;
  const cartItemsFromStore = useAppSelector((state) => state.global.cartItems);
  console.log("store cart items", cartItemsFromStore);
  // Convert Redux cartItems object to array of CartItem objects
  const cartItems = Object.values(cartItemsFromStore);
  console.log("cartitems", cartItems);
  const order = {
    items: [
      {
        id: 1,
        name: "Ergonomic Wireless Mouse with RGB Lighting",
        price: "49.99",
        quantity: 1,
      },
      {
        id: 2,
        name: "Mechanical Keyboard with Brown Switches",
        price: "64.99",
        quantity: 1,
      },
    ],
    summary: {
      itemsSubtotal: 114.98,
      shipping: 5.0,
      tax: 9.2,
    },
  };
  const grandTotal = (
    order.summary.itemsSubtotal +
    order.summary.shipping +
    order.summary.tax
  ).toFixed(2);

  const handlePlaceOrder = async (values, { setSubmitting }) => {
    console.log(values);
    return;
    try {
      const response = await post("/order-details", values);
      if (response?.status === 200) {
        toast.dismiss();
        toast.success(`Placing order...`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            if (values?.paymentMethod === "cod") {
              router.push("/home");
            }
            if (values?.paymentMethod === "card") {
              router.push("/home");
            }
          },
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.data?.error, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { width: "380px" },
      });
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${theme}`}>
        <div className="bg-white mt-5 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-300 relative">
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                address: "",
                city: "",
                phone: "",
                email: "",
                orderNotes: "",
                paymentMethod: "cod",
              }}
              validationSchema={checkoutValidationSchema}
              onSubmit={handlePlaceOrder}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ isSubmitting, values }) => (
                <Form className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Side: Billing and Notes */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                      Billing details
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block font-medium mb-2 text-sm"
                          >
                            First name <span className="text-red-600">*</span>
                          </label>
                          <Field
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="p"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block font-medium mb-2 text-sm"
                          >
                            Last name <span className="text-red-600">*</span>
                          </label>
                          <Field
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="p"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="address"
                          className="block font-medium mb-2 text-sm"
                        >
                          Street address <span className="text-red-600">*</span>
                        </label>
                        <Field
                          type="text"
                          id="address"
                          name="address"
                          placeholder="House number and street name"
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                        />
                        <ErrorMessage
                          name="address"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block font-medium mb-2 text-sm"
                        >
                          Town / City <span className="text-red-600">*</span>
                        </label>
                        <Field
                          type="text"
                          id="city"
                          name="city"
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                        />
                        <ErrorMessage
                          name="city"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block font-medium mb-2 text-sm"
                        >
                          Phone <span className="text-red-600">*</span>
                        </label>
                        <Field
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                        />
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block font-medium mb-2 text-sm"
                        >
                          Email address <span className="text-red-600">*</span>
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                        />
                        <ErrorMessage
                          name="email"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <h2 className="text-2xl font-bold pt-8 text-gray-800 dark:text-white">
                        Additional information
                      </h2>
                      <div>
                        <label
                          htmlFor="orderNotes"
                          className="block font-medium mb-2 text-sm"
                        >
                          Order notes (optional)
                        </label>
                        <Field
                          as="textarea"
                          id="orderNotes"
                          name="orderNotes"
                          rows="4"
                          placeholder="Notes about your order, e.g. special notes for delivery."
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Order Summary & Payment */}
                  <div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                        Your order
                      </h2>
                      <div className="space-y-4">
                        <div className="flex justify-between font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
                          <span>Product</span>
                          <span>Subtotal</span>
                        </div>
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-2"
                          >
                            <span>
                              {item?.product?.name} × {item.quantity}
                            </span>
                            <span>
                              $
                              {(parseFloat(item.price) * item.quantity).toFixed(
                                2
                              )}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold">
                          <span>Subtotal</span>
                          <span>${order.summary.itemsSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
                          <span>Shipping</span>
                          <span>${order.summary.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>${grandTotal}</span>
                        </div>
                      </div>
                      <div className="mt-8">
                        <ul className="space-y-2">
                          <li>
                            <label
                              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                values.paymentMethod === "cod"
                                  ? "bg-blue-50 dark:bg-gray-800 border-blue-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              <Field
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                className="mr-4 h-4 w-4 focus:ring-blue-500 text-blue-600 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"
                              />
                              <span className="font-semibold">
                                Cash on delivery
                              </span>
                            </label>
                            {values.paymentMethod === "cod" && (
                              <div className="p-4 mt-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-md">
                                Pay with cash upon delivery.
                              </div>
                            )}
                          </li>
                          <li>
                            <label
                              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                values.paymentMethod === "card"
                                  ? "bg-blue-50 dark:bg-gray-800 border-blue-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              <Field
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                className="mr-4 h-4 w-4 focus:ring-blue-500 text-blue-600 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"
                              />
                              <span className="font-semibold">
                                Card Payment
                              </span>
                              <CreditCard className="ml-auto text-gray-500 dark:text-gray-400" />
                            </label>
                            {values.paymentMethod === "card" && (
                              <div className="p-4 mt-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-md">
                                Pay with your credit or debit card.
                              </div>
                            )}
                          </li>
                        </ul>
                        <ErrorMessage
                          name="paymentMethod"
                          component="p"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-200 mt-6">
                        Your personal data will be used to process your order,
                        support your experience throughout this website, and for
                        other purposes described in our{" "}
                        <Link
                          href="#"
                          className="font-semibold text-blue-400 hover:underline"
                        >
                          privacy policy
                        </Link>
                        .
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg shadow-sm flex items-center justify-center transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Lock size={16} className="mr-2" />
                        {isSubmitting ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 max-w-5xl"></div>
    </div>
  );
};

export default OrderDetails;
