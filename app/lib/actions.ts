"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      error,
      message: "Database Error: Failed to Create Invoice",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      error,
      message: "Database Error: Failed to Update Invoice",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return {
      error,
      message: "Database Error: Failed to Delete Invoice",
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const UserSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: "Please enter your name.",
    invalid_type_error: "Name must be a string.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password length must be greater than 6.",
  }),
});

const CreateUser = UserSchema.omit({ id: true });

export type signupState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    authentication?: string[];
    database?: string[];
  };
  message?: string | null;
  success?: boolean | null;
};

export async function createUser(
  prevState: signupState | undefined,
  formData: FormData
): Promise<signupState> {
  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Account",
    };
  }

  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(name, email, hashedPassword);

  try {
    await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    `;

    return {
      success: true,
      message: "User created successfully! You can now log in.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Database Error: Failed to Create User",
    };
  }
}

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

const CreateMesssage = ContactSchema.omit({ id: true, date: true });

export type contactState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    address?: string[];
    email?: string[];
    phone?: string[];
    message?: string[];
  };
  success?: boolean | null;
  message?: string | null;
};

export type contactFormData = {
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
};

export async function sendMessage(
  prevState: contactState,
  formData: contactFormData
) {
  const validatedFields = CreateMesssage.safeParse({
    firstName: formData.firstName,
    lastName: formData.lastName,
    address: formData.address,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice",
    };
  }

  const { firstName, lastName, email, phone, address, message } =
    validatedFields.data;

  const phoneNumber: number = Number(phone);
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
    INSERT INTO messages (first_name, last_name, email, phone, address, message, date)
    VALUES (${firstName},${lastName},${email}, ${phoneNumber}, ${address}, ${message}, ${date})
    `;
  } catch (error) {
    return {
      success: false,
      error,
      message: "Server Error: Failed to Send Message",
    };
  }
  return {
    success: true,
  };
}
