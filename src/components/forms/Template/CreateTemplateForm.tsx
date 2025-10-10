import { Controller, useForm } from "react-hook-form";
import { useCreateTemplate } from "../../../hooks/useTemplate";
import { useEffect } from "react";
import { useSnackbar } from "../../../context/SnackBarContext";
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
import {
  createTemplateSchema,
  type CreateTemplateInput,
} from "../../../utils/validations/createTemplateSchema";
import FormTextField from "../../common/FormTextField";

export type CreateTemplateFormProps = {
  cancel: () => void;
  isOpen: boolean;
};

const CreateTemplateForm = (props: CreateTemplateFormProps) => {
  const { cancel, isOpen } = props;
  const { mutateAsync, isPending } = useCreateTemplate();
  const { showSnackbar } = useSnackbar();

  const form = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      template_name: "",
      type: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateTemplateInput) => {
    try {
      await mutateAsync(data);
      showSnackbar("Template created successfully", "success");
    } catch (error) {
      console.error("Error creating template:", error);
      showSnackbar("Failed to create template", "error");
    } finally {
      form.reset();
      cancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid padding={1} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
        <Typography variant="h6" gutterBottom component="p">
          Template Details
        </Typography>
        <Grid container direction={"row"} spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <FormTextField
              name="template_name"
              label="Template Name"
              control={control}
              required
              error={!!errors?.template_name}
              helperText={errors?.template_name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
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
                    />
                    <FormControlLabel
                      value="sms"
                      control={<Radio />}
                      label="SMS"
                    />
                  </RadioGroup>
                  {errors.type && (
                    <p style={{ color: "red" }}>{errors.type.message}</p>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 1 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={cancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Template"}
        </Button>
      </Box>
    </form>
  );
};

export default CreateTemplateForm;
