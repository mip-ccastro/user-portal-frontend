import { z } from "zod";

export const updateTemplateSchema = z.object({
    type: z.enum(["email", "sms"], "Template type is required"),
    template_name: z.string().min(1, "Template name is required"),
    content: z.string().optional(),
    recipients: z.array(z.string()).optional(),
    form_id: z.string().optional(),
})

export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;