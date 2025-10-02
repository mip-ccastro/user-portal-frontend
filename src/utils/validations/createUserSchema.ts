import { z } from "zod";

const regex_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/

export const createUserSchema = z.object({
    username: z.string()
        .min(8, "Username must be at least 8 characters long")
        .max(20, "Username must be at most 20 characters long")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email address"),
    user_role: z.string().min(1, "User role is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(20, "Password must be at most 20 characters long")
        .regex(regex_password, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>;