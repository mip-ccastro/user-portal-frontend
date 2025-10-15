/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslist-disable @typescript-eslint/ban-ts-comment */

import { ArrowLeft, File } from "lucide-react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { navigateTo } from "../services/navigateService";
import {
  updateForm,
  type UpdateFormInput,
} from "../utils/validations/updateForm";
import { useEffect } from "react";
import { useFetchForm, useUpdateForm } from "../hooks/useFormHook";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../context/SnackBarContext";
import { zodResolver } from "@hookform/resolvers/zod";
import FormBuilder from "../components/common/FormBuilder";
import FormTextField from "../components/common/FormTextField";
import isArray from "lodash/isArray";
import Loading from "../components/common/Loading";
import type { Schema } from "../components/common/FormBuilder/types";

const Form = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFetchForm(id ?? "");
  const { mutateAsync, isPending } = useUpdateForm();
  const { showSnackbar } = useSnackbar();

  const form = useForm<UpdateFormInput>({
    resolver: zodResolver(updateForm),
    defaultValues: {
      form_name: "",
      form_description: "",
      form_fields: [],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = form;

  const onSubmit = async (data: UpdateFormInput) => {
    try {
      await mutateAsync({ formId: id ?? "", form: data });
      showSnackbar("Form updated successfully", "success");
    } catch (error) {
      console.error("Error updating form:", error);
      showSnackbar("Failed to update form", "error");
    }
  };

  useEffect(() => {
    if (!data) return;
    reset({
      form_name: data.form_name,
      form_description: data.form_description,
      form_fields: isArray(data.form_fields)
        ? []
        : JSON.parse(data.form_fields),
    });
  }, [data, reset]);

  if (isLoading)
    return (
      <Loading fullScreen={false} backdrop={false} message="Fetching form..." />
    );
  if (isError) return <p>Error</p>;

  return (
    <form>
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
          <Button
            onClick={() => navigateTo(-1)}
            variant="contained"
            color="secondary"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || !isDirty}
          >
            {isPending ? "Updating..." : "Update Form"}
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <File />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold" }}
            noWrap
            component="div"
          >
            Form
          </Typography>
        </Box>
        <Grid container direction={"row"} spacing={2}>
          <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 3.7, lg: 4 }}>
              <FormTextField
                name="form_name"
                label="Form Name"
                type="text"
                control={control}
                required
                error={!!errors?.form_name}
                helperText={errors?.form_name?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 3.7, lg: 8 }}>
              <FormTextField
                name="form_description"
                label="Form Description"
                type="textarea"
                multiline
                control={control}
                error={!!errors?.form_description}
                helperText={errors?.form_description?.message}
              />
            </Grid>
          </Grid>
          <Grid container size={12}>
            <Box sx={{ width: "100%" }}>
              <Controller
                name="form_fields"
                control={control}
                render={({ field }) => (
                  <FormBuilder
                    fields={field.value as Schema[]}
                    setFields={field.onChange}
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
    </form>
  );
};

export default Form;
