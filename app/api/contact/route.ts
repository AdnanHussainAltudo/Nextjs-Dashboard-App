import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@vercel/postgres";

const ContactSchema = z.object({
  id: z.string(),
  firstName: z
    .string({
      invalid_type_error: "Please enter a valid name.",
    })
    .nonempty("First name is required."),
  lastName: z
    .string({
      invalid_type_error: "Please enter a valid name.",
    })
    .nonempty("Last name is required."),
  email: z
    .string({
      invalid_type_error: "Please enter a valid email.",
    })
    .email("Invalid email format."),
  phone: z
    .string({ invalid_type_error: "Phone number must be a string." })
    .refine((value) => /^\d+$/.test(value), {
      message: "Phone number should contain only numeric digits.",
    })
    .refine((value) => value.length === 10, {
      message: "Phone number must be exactly 10 digits.",
    }),
  address: z
    .string({
      invalid_type_error: "Please enter a valid address.",
    })
    .nonempty("Address is required."),
  message: z
    .string({
      invalid_type_error: "Please enter a valid message.",
    })
    .nonempty("Message is required."),
  date: z.string(),
});

const CreateMessage = ContactSchema.omit({ id: true, date: true });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedFields = CreateMessage.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          errors: validatedFields.error.flatten().fieldErrors,
          message: "Missing Fields. Failed to Create Message",
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, address, message } =
      validatedFields.data;

    const phoneNumber: number = Number(phone);
    const date = new Date().toISOString().split("T")[0];

    await sql`
      INSERT INTO messages (first_name, last_name, email, phone, address, message, date)
      VALUES (${firstName}, ${lastName}, ${email}, ${phoneNumber}, ${address}, ${message}, ${date})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Server Error: Failed to Send Message",
      },
      { status: 500 }
    );
  }
}
