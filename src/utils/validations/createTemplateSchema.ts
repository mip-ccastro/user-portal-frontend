import { z } from "zod";

export const createTemplateSchema = z.object({
    type: z.string().min(1, "Template type is required"),
    template_name: z.string().min(1, "Template name is required")
})

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;