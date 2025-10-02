import { z } from "zod";

export const updateUserSchema = z.object({
    username: z.string().optional(),
    email: z.string().email("Invalid email address"),
    user_role: z.string().min(1, "User role is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    user_status: z.number(),
    
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>;