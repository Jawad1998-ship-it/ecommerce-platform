"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useTheme } from "next-themes";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type AddressFormValues = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

// Custom ErrorMessage component to show errors only after submission
const CustomErrorMessage = ({
  name,
  submitCount,
}: {
  name: string;
  submitCount: number;
}) => {
  return submitCount > 0 ? (
    <ErrorMessage
      name={name}
      component="p"
      className="mt-1 text-sm text-red-600"
    />
  ) : null;
};

const SettingsPage = () => {
  const { theme } = useTheme();
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Profile form initial values
  const profileInitialValues: ProfileFormValues = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  // Password form initial values
  const passwordInitialValues: PasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // Address form initial values
  const addressInitialValues: AddressFormValues = {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  // Profile form validation
  const validateProfile = (values: ProfileFormValues) => {
    const errors: Partial<ProfileFormValues> = {};
    if (!values.firstName.trim()) errors.firstName = "First name is required";
    if (!values.lastName.trim()) errors.lastName = "Last name is required";
    if (!values.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errors.email = "Please enter a valid email";
    return errors;
  };

  // Password form validation
  const validatePassword = (values: PasswordFormValues) => {
    const errors: Partial<PasswordFormValues> = {};
    if (!values.currentPassword)
      errors.currentPassword = "Current password is required";
    if (!values.newPassword) errors.newPassword = "New password is required";
    else if (values.newPassword.length < 8)
      errors.newPassword = "Password must be at least 8 characters";
    if (!values.confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (values.newPassword !== values.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  // Address form validation
  const validateAddress = (values: AddressFormValues) => {
    const errors: Partial<AddressFormValues> = {};
    if (!values.street.trim()) errors.street = "Street is required";
    if (!values.city.trim()) errors.city = "City is required";
    if (!values.state.trim()) errors.state = "State is required";
    if (!values.zip.trim()) errors.zip = "ZIP code is required";
    if (!values.country.trim()) errors.country = "Country is required";
    return errors;
  };

  // Profile form submission
  const handleProfileSubmit = async (
    values: ProfileFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      // Simulate API call
      // await fetch("/api/user", { method: "PUT", body: JSON.stringify(values) });
      setSuccessMessage("Your profile has been updated.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Password form submission
  const handlePasswordSubmit = async (
    values: PasswordFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      // Simulate API call
      // await fetch("/api/user/password", { method: "PUT", body: JSON.stringify(values) });
      setSuccessMessage("Your password has been updated.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPasswordModal(false);
      resetForm();
    } catch (error) {
      setSuccessMessage("Failed to update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Address form submission
  const handleAddressSubmit = async (
    values: AddressFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      // Simulate API call
      // await fetch("/api/user/addresses", { method: "POST", body: JSON.stringify(values) });
      setSuccessMessage("New address added successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowAddressModal(false);
      resetForm();
    } catch (error) {
      setSuccessMessage("Failed to add address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${theme} min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className={`${theme} text-2xl font-bold text-gray-900 mb-6`}>
          Your Account
        </h1>

        {/* Personal Information Form */}
        <Formik
          initialValues={profileInitialValues}
          validate={validateProfile}
          onSubmit={handleProfileSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({
            isSubmitting,
            submitCount,
            setErrors,
            handleChange,
          }: FormikProps<ProfileFormValues>) => (
            <Form
              className={`${
                theme === "dark" && "#0f3460"
              } border border-gray-200 rounded-md p-6 mb-6`}
            >
              <h2 className="text-lg font-semibold mb-4">Login & Security</h2>
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900"
                    placeholder="Enter your first name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update form state
                      setErrors({
                        ...validateProfile({
                          ...profileInitialValues,
                          firstName: e.target.value,
                        }),
                        firstName: undefined,
                      });
                    }}
                  />
                  <CustomErrorMessage
                    name="firstName"
                    submitCount={submitCount}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900"
                    placeholder="Enter your last name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update form state
                      setErrors({
                        ...validateProfile({
                          ...profileInitialValues,
                          lastName: e.target.value,
                        }),
                        lastName: undefined,
                      });
                    }}
                  />
                  <CustomErrorMessage
                    name="lastName"
                    submitCount={submitCount}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900"
                    placeholder="Enter your email"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Update form state
                      setErrors({
                        ...validateProfile({
                          ...profileInitialValues,
                          email: e.target.value,
                        }),
                        email: undefined,
                      });
                    }}
                  />
                  <CustomErrorMessage name="email" submitCount={submitCount} />
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-md hover:bg-yellow-500 disabled:bg-yellow-300 transition duration-200"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
                <button
                  type="reset"
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              </div>

              {successMessage && (
                <p
                  className={`mt-4 text-sm ${
                    successMessage.includes("Failed")
                      ? "text-red-600"
                      : "text-green-600"
                  } text-center`}
                >
                  {successMessage}
                </p>
              )}
            </Form>
          )}
        </Formik>

        {/* Password Management */}
        <section
          className={`${
            theme === "dark" && "#0f3460"
          } border border-gray-200 rounded-md p-6 mb-6`}
        >
          <h2 className="text-lg font-semibold mb-4">Password</h2>
          <p className="text-sm mb-4">
            Change your password to keep your account secure.
          </p>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-md hover:bg-yellow-500 transition duration-200"
          >
            Change Password
          </button>
        </section>

        {/* Address Book */}
        <section
          className={`${
            theme === "dark" && "#0f3460"
          } border border-gray-200 rounded-md p-6`}
        >
          <h2 className="text-lg font-semibold mb-4">Addresses</h2>
          <p className="text-sm mb-4">
            Manage your shipping and billing addresses.
          </p>
          <button
            type="button"
            onClick={() => setShowAddressModal(true)}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-medium rounded-md hover:bg-yellow-500 transition duration-200"
          >
            Add New Address
          </button>
        </section>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-md p-6 max-w-md w-full`}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Change Password
              </h2>
              <Formik
                initialValues={passwordInitialValues}
                validate={validatePassword}
                onSubmit={handlePasswordSubmit}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({
                  isSubmitting,
                  submitCount,
                  setErrors,
                  handleChange,
                }: FormikProps<PasswordFormValues>) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Current Password
                      </label>
                      <Field
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter current password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validatePassword({
                              ...passwordInitialValues,
                              currentPassword: e.target.value,
                            }),
                            currentPassword: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="currentPassword"
                        submitCount={submitCount}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        New Password
                      </label>
                      <Field
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter new password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validatePassword({
                              ...passwordInitialValues,
                              newPassword: e.target.value,
                            }),
                            newPassword: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="newPassword"
                        submitCount={submitCount}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Confirm new password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validatePassword({
                              ...passwordInitialValues,
                              confirmPassword: e.target.value,
                            }),
                            confirmPassword: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="confirmPassword"
                        submitCount={submitCount}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-yellow-400 text-gray-900 dark:text-gray-900 font-medium rounded-md hover:bg-yellow-500 disabled:bg-yellow-300 transition duration-200"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-md p-6 max-w-md w-full`}
            >
              <Formik
                initialValues={addressInitialValues}
                validate={validateAddress}
                onSubmit={handleAddressSubmit}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({
                  isSubmitting,
                  submitCount,
                  setErrors,
                  handleChange,
                }: FormikProps<AddressFormValues>) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Street Address
                      </label>
                      <Field
                        type="text"
                        id="street"
                        name="street"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter street address"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validateAddress({
                              ...addressInitialValues,
                              street: e.target.value,
                            }),
                            street: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="street"
                        submitCount={submitCount}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        City
                      </label>
                      <Field
                        type="text"
                        id="city"
                        name="city"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter city"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validateAddress({
                              ...addressInitialValues,
                              city: e.target.value,
                            }),
                            city: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="city"
                        submitCount={submitCount}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        State
                      </label>
                      <Field
                        type="text"
                        id="state"
                        name="state"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter state"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validateAddress({
                              ...addressInitialValues,
                              state: e.target.value,
                            }),
                            state: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="state"
                        submitCount={submitCount}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        ZIP Code
                      </label>
                      <Field
                        type="text"
                        id="zip"
                        name="zip"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter ZIP code"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validateAddress({
                              ...addressInitialValues,
                              zip: e.target.value,
                            }),
                            zip: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="zip"
                        submitCount={submitCount}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Country
                      </label>
                      <Field
                        type="text"
                        id="country"
                        name="country"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter country"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setErrors({
                            ...validateAddress({
                              ...addressInitialValues,
                              country: e.target.value,
                            }),
                            country: undefined,
                          });
                        }}
                      />
                      <CustomErrorMessage
                        name="country"
                        submitCount={submitCount}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-yellow-400 text-gray-900 dark:text-gray-900 font-medium rounded-md hover:bg-yellow-500 disabled:bg-yellow-300 transition duration-200"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
