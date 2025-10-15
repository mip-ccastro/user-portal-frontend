import { addField, type AddFieldInput } from "./schema/add-field";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import FormTextField from "../../FormTextField";
import type { FieldType, Schema } from "../types";

export type AddFieldform = {
  cancel: () => void;
  isOpen: boolean;
  onSubmit: (data: Schema) => void;
};

const types = ["text", "number", "email", "textarea", "tel", "select"];

const AddFieldForm = (props: AddFieldform) => {
  const { cancel, isOpen, onSubmit: submitAddField } = props;

  const form = useForm<AddFieldInput>({
    resolver: zodResolver(addField),
    defaultValues: {
      id: "",
      name: "",
      type: "text",
      label: "",
      placeHolder: "",
      options: "",
      validation: {
        required: false,
        min: "",
        max: "",
        pattern: "",
      },
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: AddFieldInput) => {
    const transformedData: Schema = {
      id: uuidv4(),
      name: data.name,
      type: data.type as FieldType,
      label: data.label,
      field_input: data.name.replace(/\s/g, "_").toLowerCase(),
      placeHolder: data.placeHolder,
      options: data.options,
      validation: data.validation,
    };
    submitAddField(transformedData);
  };

  return (
    <div>
      <Grid padding={1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        <Grid container direction={"row"}>
          <Grid container direction={"row"} size={12}>
            <Grid size={12}>
              <Typography variant="h6" component="p">
                Field Details
              </Typography>
            </Grid>
            <Grid size={12}>
              <FormTextField
                name="name"
                label="Field Name"
                control={control}
                required
                error={!!errors?.name}
                helperText={errors?.name?.message}
              />
            </Grid>
            <Grid size={12}>
              <FormTextField
                name="label"
                label="Label"
                control={control}
                error={!!errors?.label}
                helperText={errors?.label?.message}
              />
            </Grid>
            <Grid size={12}>
              <FormTextField
                name="placeHolder"
                label="Placeholder"
                control={control}
                error={!!errors?.placeHolder}
                helperText={errors?.placeHolder?.message}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="type"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Type"
                    fullWidth
                    required
                    size="small"
                    margin="dense"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    sx={{
                      "& .MuiFormLabel-asterisk": {
                        color: "error.main",
                      },
                    }}
                  >
                    {types.map((type) => (
                      <MenuItem key={type} value={type.toLowerCase()}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            {watch("type") === "select" && (
              <Grid size={12}>
                <FormTextField
                  name="options"
                  label="Options"
                  control={control}
                  required
                  placeHolder="Enter options separated by semicolon (;)"
                  error={!!errors?.options}
                  helperText={errors?.options?.message}
                />
              </Grid>
            )}
          </Grid>
          <Grid container size={12} direction={"column"}>
            <Grid size={12}>
              <Typography variant="h6" component="p">
                Validation
              </Typography>
            </Grid>
            {watch("type") !== "select" && (
              <>
                <Grid size={12}>
                  <FormTextField
                    name="validation.min"
                    label="Min"
                    control={control}
                    error={!!errors?.validation?.min}
                    helperText={errors?.validation?.min?.message}
                  />
                </Grid>
                <Grid size={12}>
                  <FormTextField
                    name="validation.max"
                    label="Max"
                    control={control}
                    error={!!errors?.validation?.max}
                    helperText={errors?.validation?.max?.message}
                  />
                </Grid>
                <Grid size={12}>
                  <FormTextField
                    name="pattern"
                    label="Pattern"
                    control={control}
                    error={!!errors?.validation?.pattern}
                    helperText={errors?.validation?.pattern?.message}
                  />
                </Grid>
              </>
            )}
            <Grid size={12}>
              <Controller
                name="validation.required"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} color="primary" />}
                    label="Required"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 1 }}>
        <Button variant="contained" color="secondary" onClick={cancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
          Add Field
        </Button>
      </Box>
    </div>
  );
};

export default AddFieldForm;
