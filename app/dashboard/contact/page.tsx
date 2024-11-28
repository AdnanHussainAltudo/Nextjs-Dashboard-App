import ContactForm from "@/app/ui/contact/contact-form";
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <>
      <div className="w-full">
        <div className="flex w-full items-center justify-between mb-6">
          <h1 className={`${lusitana.className} text-2xl`}>Contact Us</h1>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
