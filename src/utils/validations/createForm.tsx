import { z } from "zod";

export const createForm = z.object({
    form_name: z.string().min(1, "Form name is required"),
    form_description: z.string().optional()
})

export type CreateFormInput = z.infer<typeof createForm>;