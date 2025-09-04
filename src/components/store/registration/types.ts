import { z } from "zod";

export const storeRegistrationSchema = z
  .object({
    storeName: z
      .string()
      .min(2, { message: "Store name must be at least 2 characters" }),
    role: z.string().optional(),
    ownerName: z.string().min(2, { message: "Owner name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    address: z.string().min(5, { message: "Please enter a complete address" }),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
    businessDescription: z.string().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .optional(),
    confirmPassword: z
      .string()
      .min(8, { message: "Please confirm your password" })
      .optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type StoreRegistrationValues = z.infer<typeof storeRegistrationSchema>;

export type StepType = "business" | "address" | "account";
