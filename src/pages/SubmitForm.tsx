/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowLeft } from "lucide-react";
import { Box, Button, Divider, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { generateDynamicSchema } from "../components/common/FormBuilder/schemaGenerator";
import { navigateTo } from "../services/navigateService";
import { useAuthContext } from "../hooks/useAuth";
import { useCreateSubmission } from "../hooks/useSubmission";
import { useEffect, useMemo, useState } from "react";
import { useFetchForm } from "../hooks/useFormHook";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../context/SnackBarContext";
import { zodResolver } from "@hookform/resolvers/zod";
import Error from "../components/common/Error";
import isArray from "lodash/isArray";
import Loading from "../components/common/Loading";
import PhoneNumberField from "../components/common/PhoneNumberField";
import type { Schema } from "../components/common/FormBuilder/types";

const SubmitForm = () => {
  const { id } = useParams();
  const { user } = useAuthContext()
  const { data, isError, isLoading } = useFetchForm(id ?? "");
  const { mutateAsync, isPending } = useCreateSubmission();
  const { showSnackbar } = useSnackbar()
  const [form, setForm] = useState<{
    form_name: string;
    form_fields: Schema[];
  }>({
    form_name: "",
    form_fields: [],
  });

  const schema = useMemo(() => generateDynamicSchema(form.form_fields), [form.form_fields]);
  
  const { control, register, formState: { errors }, handleSubmit, reset } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) {
      const form_fields = isArray(data.form_fields)
        ? []
        : JSON.parse(data.form_fields);
      setForm({
        form_name: data.form_name,
        form_fields,
      });
    }
  }, [data]);

  const displayFields = (field: Schema) => {
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

  const onSubmit = async (data: any) => {
    try {
      await mutateAsync({
        form_id: id ?? "",
        user_id: user?.user_id ?? "",
        data: data
      })
      showSnackbar("Form submitted successfully", "success")
    } catch (error) {
      console.error("Error creating submission:", error);
      showSnackbar("Error submitting form", "error")
    } finally {
      reset()
    }
  };

    if (isLoading) {
        return (
            <Loading fullScreen={false} backdrop={false} message="Fetching form..." />
        );
    }
    if (isError) return <Error />

  return (
    <div>
      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        <Button
          onClick={() => navigateTo(-1)}
          startIcon={<ArrowLeft />}
          variant="outlined"
          disabled={isPending}
        >
          Back
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 4, m: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container maxWidth={800} width={800}>
                    <Grid size={12}>
                        <Typography variant="h5" fontWeight={"bold"} textAlign={"center"} gutterBottom>
                            {form.form_name}
                        </Typography>
                        <Divider sx={{ mb: 2 }}/>
                    </Grid>
                    <Grid container size={12}>
                        {
                            form?.form_fields?.length <= 0 ? (
                                <Grid size={12}>
                                    <Typography variant="h6" textAlign={"center"}>
                                        This form is empty. Please contact the administrator.
                                    </Typography>
                                </Grid>
                            ) : (
                                form?.form_fields?.map((field, index) => (
                                    <Grid size={12} key={index}>
                                        {displayFields(field)}
                                    </Grid>
                                ))
                            )
                        }
                    </Grid>
                    {
                        form?.form_fields?.length > 0 && (
                            <Grid size={12}>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
                                    <Button
                                        onClick={() => navigateTo(-1)}
                                        variant="contained"
                                        color="secondary"
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit" disabled={isPending}>
                                        {isPending ? "Submitting..." : "Submit"}
                                    </Button>
                                </Box>
                            </Grid>
                        )
                    }
                </Grid>
            </form>
        </Paper>
      </Box>
    </div>
  );
};

export default SubmitForm;
