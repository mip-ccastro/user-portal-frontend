/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { navigateTo } from "../services/navigateService";
import {
  updateTemplateSchema,
  type UpdateTemplateInput,
} from "../utils/validations/updateTemplateSchema";
import { useEffect } from "react";
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
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import FormTextField from "../components/common/FormTextField";
import Loading from "../components/common/Loading";
import TemplateEditor from "../components/text-editor/TemplateEditor";
import MultipleSelect from "../components/common/MultipleSelectDefault";
import { useFetchRecipients } from "../hooks/useRecipient";

const Template = () => {
  const { id } = useParams();
  const { data, isError, isLoading } = useFetchTemplate(id ?? "");
  const { data: recipients } = useFetchRecipients()
  const { mutateAsync, isPending } = useUpdateTemplate();
  const { showSnackbar } = useSnackbar();

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
    formState: { errors },
    reset,
  } = form;

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
    if (!data) return;
    reset({
      template_name: data.template_name,
      type: data.type,
      content: data.content,
      recipients: data.recipients?.map((recipient: any) => recipient.id) ?? [],
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
          <Button variant="contained" type="submit" disabled={isPending}>
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
            <Grid size={{ xs: 12, sm: 12, md: 3.7, lg: 3.7 }}>
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
          <Grid container size={{  xs: 12, sm: 12, md: 12, lg: 12 }} direction={"row"}>
            <Grid>
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
            <Grid>
              <Controller
                name="recipients"
                control={control}
                rules={{ required: "Please select a template type." }}
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
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <TemplateEditor form={form} isUpdating={isPending} />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Template;
