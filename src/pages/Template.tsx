/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { navigateTo } from "../services/navigateService";
import {
  updateTemplateSchema,
  type UpdateTemplateInput,
} from "../utils/validations/updateTemplateSchema";
import { useEffect, useState } from "react";
import { useFetchTemplate, useUpdateTemplate } from "../hooks/useTemplate";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../context/SnackBarContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import FormTextField from "../components/common/FormTextField";
import Loading from "../components/common/Loading";
import TemplateEditor from "../components/text-editor/TemplateEditor";
import MultipleSelect from "../components/common/MultipleSelectDefault";
import { useFetchRecipients } from "../hooks/useRecipient";
import { useFetchForms } from "../hooks/useFormHook";
import { isArray } from "lodash";

const Template = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFetchTemplate(id ?? "");
  const { data: recipients } = useFetchRecipients()
  const { data: forms } = useFetchForms()
  const { mutateAsync, isPending } = useUpdateTemplate();
  const { showSnackbar } = useSnackbar();
  const [variables, setVariables] = useState<Array<{ label: string; value: string }>>([]);

  const form = useForm<UpdateTemplateInput>({
    resolver: zodResolver(updateTemplateSchema),
    defaultValues: {
      template_name: "",
      type: "email",
      content: "",
      recipients: [],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    watch
  } = form;

  const selected_form = watch('form_id')

  const onSubmit = async(data: UpdateTemplateInput) => {
    try {
      await mutateAsync({ templateId: id ?? "", template: data });
      showSnackbar("Template updated successfully", "success");
    } catch (error) {
      console.error("Error updating template:", error);
      showSnackbar("Failed to update template", "error");
    }
  };

  useEffect(() => {
    if(forms?.length > 0 && selected_form) {
      const form = forms?.find((form: any) => form.id === selected_form)
      if(form) {
        const form_fields = isArray(form.form_fields) ? form.form_fields : JSON.parse(form.form_fields)
        const formatted_fields = form_fields?.map((field: any) => ({ label: field.name, value: `{{${field.field_input}}}` }))
        setVariables(formatted_fields)
      }
    }
  }, [selected_form, setVariables, forms])

  useEffect(() => {
    if (!data) return;
    reset({
      template_name: data.template_name,
      type: data.type,
      content: data.content,
      recipients: data.recipients?.map((recipient: any) => recipient.id) ?? [],
      form_id: data?.form?.id || ""
    });
  }, [data, reset]);

  if (isLoading)
    return (
      <Loading
        fullScreen={false}
        backdrop={false}
        message="Fetching template..."
      />
    );
  if (isError) return <p>Error</p>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
          <Button
            onClick={() => navigateTo(-1)}
            startIcon={<ArrowLeft />}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            onClick={() => navigateTo(-1)}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={isPending || !isDirty}>
            {isPending ? "Updating..." : "Update Template"}
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LayoutTemplate />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold" }}
            noWrap
            component="div"
          >
            Template
          </Typography>
        </Box>
        <Grid container direction={"row"} spacing={2}>
          <Grid container size={{  xs: 12, sm: 12, md: 12, lg: 12 }}>
            <Grid size={{ xs: 12, sm: 12, md: 3.7, lg: 6 }}>
              <FormTextField
                name="template_name"
                label="Template Name"
                control={control}
                required
                error={!!errors?.template_name}
                helperText={errors?.template_name?.message}
              />
            </Grid>
          </Grid>
          <Grid container size={6} direction={"row"}>
            <Grid size={3}>
              <Controller
              name="type"
              control={control}
              rules={{ required: "Please select a template type." }}
              render={({ field }) => (
                <FormControl component="fieldset" error={!!errors.type}>
                  <FormLabel id="template-type-label">Template Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="template-type-label"
                    name={field.name}
                    onChange={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                  >
                    <FormControlLabel
                      value="email"
                      control={<Radio />}
                      label="Email"
                      disabled
                    />
                    <FormControlLabel
                      value="sms"
                      control={<Radio />}
                      label="SMS"
                      disabled
                    />
                  </RadioGroup>
                  {errors.type && (
                    <p style={{ color: "red" }}>{errors.type.message}</p>
                  )}
                </FormControl>
              )}
            />
            </Grid>
            <Grid size={5}>
              <Controller
                name="recipients"
                control={control}
                rules={{ required: "Please select a recipients." }}
                render={({ field }) => (
                  <MultipleSelect
                    label="Recipients"
                    onChange={field.onChange}
                    value={field.value!}
                    options={recipients?.map(({ name, id }: { name: string, id: string }) => ({ label: name, value: id }))}
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="form_id"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                      {...field}
                      select
                      label="Form"
                      fullWidth
                      size="medium"
                      margin="dense"
                      error={!!errors.form_id}
                      helperText={errors.form_id?.message}
                      sx={{
                        "& .MuiFormLabel-asterisk": {
                          color: "error.main",
                        },
                      }}
                    >
                        {forms?.map((form: any) => (
                          <MenuItem key={form.form_name} value={form.id}>
                            {form.form_name}
                          </MenuItem>
                        ))}
                      </TextField>
                )}
              />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <TemplateEditor form={form} isUpdating={isPending} variables={variables} />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Template;
