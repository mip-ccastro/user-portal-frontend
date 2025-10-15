/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from 'zod';
import type { Schema } from './types';

export const createFieldSchema = (field: Schema) => {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'email':
      schema = z.string().email('Invalid email address');
      break;
    case 'number':
      schema = z.string().regex(/^\d+$/, 'Must be a valid number');
      break;
    case 'tel':
      schema = z.string().regex(/^[\d\s\-+()]+$/, 'Must be a valid phone number');
      break;
    case 'text':
    case 'textarea':
    default:
      schema = z.string();
      break;
  }

  if (field.validation) {
    const { required, min = "", max = "", pattern = "" } = field.validation;

    if (required) {
      schema = (schema as z.ZodString).min(1, `${field.name} is required`);
    } else {
      schema = schema.optional();
    }

    if (min !== "") {
      schema = (schema as z.ZodString).min(parseInt(min!), `${field.name} must be at least ${min} characters`);
    }

    if (max !== "") {
      const maxValue = max;
      schema = (schema as z.ZodString).max(parseInt(maxValue!), `${field.name} must be at most ${maxValue} characters`);
    }

    if (pattern) {
      schema = (schema as z.ZodString).regex(new RegExp(pattern), `${field.name} format is invalid`);
    }
  } else {
    schema = schema.optional();
  }

  return schema;
};

export const generateDynamicSchema = (fields: Schema[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    schemaFields[field.field_input] = createFieldSchema(field);
  });

  return z.object(schemaFields);
};

export type InferSchemaType<T extends Schema[]> = z.infer<ReturnType<typeof generateDynamicSchema>>;