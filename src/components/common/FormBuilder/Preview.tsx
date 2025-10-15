/* eslint-disable @typescript-eslint/no-explicit-any */

import type { UseFormReturn } from "react-hook-form";
import type { Schema } from "./types";
import { Box, Button, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import PhoneNumberField from "../PhoneNumberField";

export interface PreviewProps {
  fields: Schema[];
  form: UseFormReturn<
    Record<string, unknown>,
    unknown,
    Record<string, unknown>
  >;
  onSubmit: (data: any) => void;
}

const Preview = (props: PreviewProps) => {
  const { fields, form, onSubmit } = props ?? {};

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = form;

  const showPreview = (field: Schema) => {
    switch (field.type) {
      case "textarea":
        return (
          <TextField
            error={errors[field.field_input] !== undefined}
            fullWidth
            helperText={errors[field.field_input]?.message as string}
            label={field.label ? field.label : field.name}
            margin="dense"
            multiline
            placeholder={field.placeHolder}
            required={field.validation?.required}
            rows={4}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "error.main",
              },
            }}
            {...register(field.field_input)}
          />
        );
      case "select":
        return (
          <TextField
            error={errors[field.field_input] !== undefined}
            fullWidth
            helperText={errors[field.field_input]?.message as string}
            label={field.label ? field.label : field.name}
            margin="dense"
            placeholder={field.placeHolder ? field.placeHolder : field.label}
            required={field.validation?.required}
            select
            size="small"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "error.main",
              },
            }}
            {...register(field.field_input)}
          >
            {field.options?.split(";").map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case "tel":
        return (
          <PhoneNumberField
            control={control}
            name={field.field_input}
            label={field.label ? field.label : field.name}
            required={field.validation?.required}
            error={errors[field.field_input]?.message as string}
            helperText={errors[field.field_input]?.message as string}
          />
        );
      default:
        return (
          <TextField
            error={errors[field.field_input] !== undefined}
            fullWidth
            helperText={errors[field.field_input]?.message as string}
            label={field.label ? field.label : field.name}
            margin="dense"
            placeholder={field.placeHolder ? field.placeHolder : field.label}
            required={field.validation?.required}
            size="small"
            type={field.type}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "error.main",
              },
            }}
            {...register(field.field_input)}
          />
        );
    }
  };

  return (
    <Paper
      style={{
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "24px",
      }}
    >
      {fields.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "#9ca3af",
          }}
        >
          Add fields to see the preview
        </div>
      ) : (
        <Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
          </Box>
          <Box>
            <div>
              <Grid container direction={"column"}>
                {fields.map((field) => (
                  <Grid key={field.id} size={12}>
                    {showPreview(field)}
                  </Grid>
                ))}
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmit(onSubmit)}
                >
                  Test Fields
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Box>
            </div>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default Preview;
