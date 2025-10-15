import { Grid, TextField, InputAdornment } from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import {
  usePhoneInput,
  CountrySelector,
  defaultCountries
} from "react-international-phone";
import "react-international-phone/style.css";
import { forwardRef } from "react";

interface PhoneNumberFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  defaultCountry?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

const PhoneNumberField = <T extends FieldValues>({
  control,
  name,
  label = "Phone Number",
  defaultCountry = "ph",
  required = false,
  disabled = false,
  error,
  helperText,
}: PhoneNumberFieldProps<T>) => {
  return (
    <Grid container>
      <Grid size={12} my={1}>
        <Controller
          name={name}
          control={control}
          rules={{
            required: required ? "Phone number is required" : false,
            validate: (value) => {
              if (required && !value) return "Phone number is required";
              if (value && value.length < 8) return "Phone number is too short";
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <PhoneInputField
              {...field}
              label={label}
              defaultCountry={defaultCountry}
              disabled={disabled}
              error={!!fieldState.error || !!error}
              helperText={fieldState.error?.message || helperText}
              required={required}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  defaultCountry: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const PhoneInputField = forwardRef<HTMLInputElement, PhoneInputFieldProps>(
  (
    {
      value,
      onChange,
      label,
      defaultCountry,
      disabled = false,
      error = false,
      helperText,
      required = false,
    },
  ) => {
    const {
      inputValue,
      handlePhoneValueChange,
      inputRef,
      country,
      setCountry,
    } = usePhoneInput({
      defaultCountry,
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

    return (
      <TextField
        variant="outlined"
        label={label}
        color="primary"
        placeholder="Phone number"
        value={inputValue}
        onChange={handlePhoneValueChange}
        type="tel"
        inputRef={inputRef}
        disabled={disabled}
        error={error}
        helperText={helperText}
        required={required}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 1, ml: -0.5 }}>
              <CountrySelector
                selectedCountry={country.iso2}
                onSelect={({ iso2 }) => setCountry(iso2)}
                renderButtonWrapper={({ children, rootProps }) => (
                  <button
                    {...rootProps}
                    type="button"
                    style={{
                      border: "none",
                      background: "none",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      cursor: disabled ? "default" : "pointer",
                    }}
                    disabled={disabled}
                  >
                    {children}
                  </button>
                )}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "error.main",
          },
          // Make dropdown absolute and styled
          "& .react-international-phone-country-selector-dropdown": {
            position: "absolute !important",
            top: "calc(100% + 4px) !important",
            left: "0 !important",
            zIndex: 1300,
            maxHeight: "300px",
            overflowY: "auto",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            backgroundColor: "white",
          },
          "& .react-international-phone-country-selector-dropdown__list-item": {
            padding: "8px 12px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
      />
    );
  }
);

PhoneInputField.displayName = "PhoneInputField";

export default PhoneNumberField;
