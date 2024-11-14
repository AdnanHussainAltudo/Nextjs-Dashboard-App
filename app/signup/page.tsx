import AcmeLogo from "@/app/ui/acme-logo";
import { Metadata } from "next";
import SignupForm from "../ui/signup-form";

export const metadata: Metadata = {
  title: "Signup",
};

export default function LoginPage() {
  return (
    <main className="flex justify-center md:h-screen">
      <div className="relative mx-auto my-8 flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <SignupForm />
      </div>
    </main>
  );
}
