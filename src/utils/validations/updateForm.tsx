import { z } from "zod";

const formFields = z.object({
    id: z.string(),
    name: z.string().min(1, "Field Name is required"),
    label: z.string(),
    field_input: z.string().optional(),
    type: z.string(),
    placeHolder: z.string().optional(),
    options: z.string(),
    validation: z.object({
        required: z.boolean().default(false).optional(),
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

export const updateForm = z.object({
    form_name: z.string().min(1, "Form name is required"),
    form_description: z.string().optional(),
    form_fields: z.array(formFields).optional(),
})

export type UpdateFormInput = z.infer<typeof updateForm>;