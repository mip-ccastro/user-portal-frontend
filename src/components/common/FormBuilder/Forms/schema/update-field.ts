import { z } from "zod";

export const updateField = z.object({
    id: z.string(),
    name: z.string().min(1, "Field Name is required"),
    label: z.string(),
    field_input: z.string().optional(),
    type: z.string(),
    placeHolder: z.string().optional(),
    options: z.string(),
    validation: z.object({
        required: z.boolean().optional(),
        min: z.string().optional(),
        max: z.string().optional(),
        pattern: z.string().optional(),
    }).optional()
}).refine((val) => {
    if (val.type === 'select') {
        return !!val.options;
    }
    return true;
}, {
    message: 'Select options are required when the field type is "select".',
    path: ['options'], 
});

export type UpdateFieldInput = z.infer<typeof updateField>;