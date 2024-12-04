"use client";

import { useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  AtSymbolIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "First name should only contain letters and spaces"
    ),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Last name should only contain letters and spaces"
    ),
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  message: yup.string().required("Message is required"),
});

async function sendMessageToApi(data: ContactFormData): Promise<ApiResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send message.");
  }

  return response.json();
}

interface ApiResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  message: string;
}

interface ErrorResponse {
  response?: {
    errors: Record<string, string[]>;
  };
  message: string;
}

export default function ContactForm() {
  const router = useRouter();
  const [errorState, setErrorState] = useState<Record<string, string[]>>({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
  });

  const mutation: UseMutationResult<
    ApiResponse,
    ErrorResponse,
    ContactFormData
  > = useMutation({
    mutationFn: sendMessageToApi,
    onSuccess: () => {
      setTimeout(() => {
        reset();
        alert("Message sent successfully!");
        router.push("/dashboard");
      }, 1000);
    },
    onError: (error: ErrorResponse) => {
      const serverErrors = error?.response?.errors || {};
      setErrorState(serverErrors);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  const renderErrors = (fieldName: keyof ContactFormData) => {
    const clientError = errors[fieldName]?.message;
    const serverErrors = errorState[fieldName];
    const allErrors = [];

    if (clientError) allErrors.push(clientError);
    if (serverErrors) allErrors.push(...serverErrors);

    return allErrors.map((error, index) => (
      <p className="mt-2 text-sm text-red-500" key={index}>
        {error}
      </p>
    ));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md bg-gray-50 p-4 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="firstName"
                {...register("firstName")}
                type="text"
                placeholder="Enter your First Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              />
              <UserCircleIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
            {renderErrors("firstName")}
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last Name
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="lastName"
                {...register("lastName")}
                type="text"
                placeholder="Enter your Last Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              />
              <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
            {renderErrors("lastName")}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium">
            Address
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="address"
              {...register("address")}
              type="text"
              placeholder="Enter your Address"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
            />
            <MapPinIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {renderErrors("address")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Enter your Email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              />
              <AtSymbolIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
            {renderErrors("email")}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="phone"
                {...register("phone")}
                type="text"
                placeholder="Enter your Phone Number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              />
              <PhoneIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
            {renderErrors("phone")}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="message"
              {...register("message")}
              placeholder="Enter your Message"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              rows={3}
            />
            <ChatBubbleLeftIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {renderErrors("message")}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={mutation.status === "pending"}
            className={clsx(
              "px-4 py-2 rounded-md text-white",
              mutation.status === "pending"
                ? "!bg-blue-200 !cursor-not-allowed"
                : "!bg-blue-500"
            )}
          >
            {mutation.status === "pending" ? "Submitting..." : "Send Message"}
          </Button>
        </div>
      </div>
    </form>
  );
}
