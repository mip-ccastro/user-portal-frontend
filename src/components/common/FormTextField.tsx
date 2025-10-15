/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Controller, type Control } from "react-hook-form";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  label: string;
  type?: string;
  control: Control<any>;
  rules?: any;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  defaultValue?: string;
  required?: boolean;
  placeHolder?: string;
  multiline?: boolean;
  rows?: number;
};

const FormTextField = ({
  name,
  label,
  type = "text",
  required,
  control,
  disabled = false,
  rules,
  onBlur,
  error,
  helperText,
  defaultValue,
  placeHolder,
  multiline,
  rows
}: Props) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    rules={rules}
    disabled={disabled}
    render={({ field, fieldState }) => {
      const showError = error ?? !!fieldState.error;
      const showHelperText = helperText ?? fieldState.error?.message;

      return (
        <TextField
          {...field}
          margin="dense"
          size="small"
          fullWidth
          label={label}
          required={required}
          type={type}
          error={showError}
          helperText={showHelperText}
          placeholder={placeHolder}
          multiline={multiline}
          rows={rows}
          sx={{
            "& .MuiFormLabel-asterisk": {
              color: "error.main",
            },
          }}
          onBlur={(e) => {
            field.onBlur();
            onBlur?.(e as React.FocusEvent<HTMLInputElement>);
          }}
        />
      );
    }}
  />
);

export default FormTextField;
