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
import { useActionState, useEffect } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const initialState: contactState = { message: null, errors: {} };
  const [state, formAction] = useActionState(sendMessage, initialState);

  const router = useRouter();

  useEffect(() => {
    console.log(state);
    if (state.success) {
      alert("Message sent!");
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <>
      <form action={formAction}>
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
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your First Name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="firstName-error"
                  />
                  <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div id="firstName-error" aria-live="polite" aria-atomic="true">
                {state.errors?.firstName &&
                  state.errors.firstName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
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
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your Last Name"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="lastName-error"
                  />
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div id="lastName-error" aria-live="polite" aria-atomic="true">
                {state.errors?.lastName &&
                  state.errors.lastName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Residential Address
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your Residential Address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="address-error"
                />
                <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div id="address-error" aria-live="polite" aria-atomic="true">
              {state.errors?.address &&
                state.errors.address.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Enter your Email Address"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="email-error"
                  />
                  <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                  state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Enter your Phone Number"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="phone-error"
                  />
                  <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div id="phone-error" aria-live="polite" aria-atomic="true">
                {state.errors?.phone &&
                  state.errors.phone.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Message
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter your Residential Address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="message-error"
                  rows={3}
                ></textarea>
                <div>
                  <ChatBubbleLeftIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
            <div id="message-error" aria-live="polite" aria-atomic="true">
              {state.errors?.message &&
                state.errors.message.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button type="submit">Send Message</Button>
        </div>
      </form>
    </>
  );
}
