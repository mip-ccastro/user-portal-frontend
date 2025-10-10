import { z } from "zod";

export const addRecipient = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Phone number is required"),
})

export type AddRecipientInput = z.infer<typeof addRecipient>;