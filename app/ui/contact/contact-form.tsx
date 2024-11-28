"use client";

import { contactState, sendMessage } from "@/app/lib/actions";
import {
  AtSymbolIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { contactFormData } from "@/app/lib/definitions";
import clsx from "clsx";

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "First name should only contain characters and spaces"
    ),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Last name should only contain characters and spaces"
    ),
  address: yup.string().required("Address is required"),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test(
      "is-digits-only",
      "Phone number should only contain digits",
      (value) => /^\d*$/.test(value || "")
    )
    .test(
      "is-exact-length",
      "Phone number must be exactly 10 digits in length",
      (value) => value?.length === 10 || !value
    )
    .test(
      "does-not-start-with-zero",
      "Phone number cannot start with 0",
      (value) => !value?.startsWith("0")
    ),
  message: yup.string().required("Message is required"),
});

export default function ContactForm() {
  const initialState: contactState = { message: null, errors: {} };
  const [state, formAction] = useActionState(sendMessage, initialState);

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: clientErrors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  useEffect(() => {
    async function checkSubmit() {
      if (state.success) {
        reset();

        setTimeout(() => {
          alert("Message sent!");
          router.push("/dashboard");
        }, 100);
      }
    }
    checkSubmit();
  }, [state, router, reset]);

  const onSubmit = (data: contactFormData) => {
    startTransition(() => {
      formAction(data);
    });
  };

  const renderErrors = (clientError?: string, serverErrors?: string[]) => {
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium"
              >
                First Name
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="firstName"
                  {...register("firstName")}
                  type="text"
                  placeholder="Enter your First Name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="firstName-error"
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="firstName-error" aria-live="polite" aria-atomic="true">
                {renderErrors(
                  clientErrors.firstName?.message,
                  state.errors?.firstName
                )}
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium"
              >
                Last Name
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="lastName"
                  {...register("lastName")}
                  type="text"
                  placeholder="Enter your Last Name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="lastName-error"
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="lastName-error" aria-live="polite" aria-atomic="true">
                {renderErrors(
                  clientErrors.lastName?.message,
                  state.errors?.lastName
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Residential Address
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="address"
                {...register("address")}
                type="text"
                placeholder="Enter your Residential Address"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="address-error"
              />
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="address-error" aria-live="polite" aria-atomic="true">
              {renderErrors(
                clientErrors.address?.message,
                state.errors?.address
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="email"
                  {...register("email")}
                  type="text"
                  placeholder="Enter your Email Address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="email-error"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {renderErrors(clientErrors.email?.message, state.errors?.email)}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="phone"
                  {...register("phone")}
                  type="text"
                  placeholder="Enter your Phone Number"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="phone-error"
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="phone-error" aria-live="polite" aria-atomic="true">
                {renderErrors(clientErrors.phone?.message, state.errors?.phone)}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Message
            </label>
            <div className="relative mt-2 rounded-md">
              <textarea
                id="message"
                {...register("message")}
                placeholder="Enter your Message"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                rows={3}
                aria-describedby="message-error"
              ></textarea>
              <ChatBubbleLeftIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="message-error" aria-live="polite" aria-atomic="true">
              {renderErrors(
                clientErrors.message?.message,
                state.errors?.message
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className={clsx(
              "px-4 py-2 rounded-md text-white transition-all duration-200",
              {
                "bg-blue-500": !isPending,
                "bg-blue-200 cursor-not-allowed": isPending,
              }
            )}
          >
            {isPending ? "Submitting..." : "Send Message"}
          </Button>
        </div>
      </form>
    </>
  );
}
