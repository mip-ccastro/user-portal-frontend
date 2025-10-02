/* eslint-disable @typescript-eslint/no-explicit-any */

import { Eye, EyeOff } from 'lucide-react'
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { useController, type Control } from 'react-hook-form';
import React, { useState } from 'react';

type PasswordTextFieldProps = {
  name: string;
  label?: string;
  control: Control<any>;
  required?: boolean;
  disabled?: boolean;
};

const PasswordTextField: React.FC<PasswordTextFieldProps> = ({
  name,
  label = 'Password',
  control,
  required,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <TextField
      {...field}
      fullWidth
      label={label}
      size="small"
      margin="dense"
      disabled={disabled}
      required={required}
      type={showPassword ? 'text' : 'password'}
      error={!!error}
      helperText={error?.message}
      sx={{
        '& input::-ms-reveal': {
          display: 'none',
        },
        '& .MuiFormLabel-asterisk': {
          color: 'error.main',
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              edge="end"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordTextField;
