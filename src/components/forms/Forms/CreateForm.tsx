import { useForm } from "react-hook-form";
import {
  createForm,
  type CreateFormInput,
} from "../../../utils/validations/createForm";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useCreateForm } from "../../../hooks/useFormHook";
import { useEffect } from "react";
import { useSnackbar } from "../../../context/SnackBarContext";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "../../common/FormTextField";

export type CreateFormProps = {
  cancel: () => void;
  isOpen: boolean;
};

const CreateForm = (props: CreateFormProps) => {
  const { cancel, isOpen } = props;
  const { mutateAsync, isPending } = useCreateForm()
  const { showSnackbar } = useSnackbar();

  const form = useForm<CreateFormInput>({
    resolver: zodResolver(createForm),
    defaultValues: {
      form_name: "",
      form_description: "",
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

  const onSubmit = async (data: CreateFormInput) => {
    try {
      await mutateAsync(data);
       showSnackbar("Form created successfully", "success");
    } catch (error) {
      console.error("Error adding form:", error);
      showSnackbar("Failed to add form", "error");
    } finally {
      form.reset();
      cancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid padding={1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        <Typography variant="h6" component="p">
          Form Details
        </Typography>
        <Grid container direction={"row"} spacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <FormTextField
              name="form_name"
              label="Form Name"
              placeHolder="Form Name"
              control={control}
              required
              error={!!errors?.form_name}
              helperText={errors?.form_name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <FormTextField
              name="form_description"
              label="Form Description"
              placeHolder="Input form description"
              control={control}
              type="textarea"
              multiline
              rows={4}
              error={!!errors?.form_description}
              helperText={errors?.form_description?.message}
            />
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 1 }}>
        <Button variant="contained" color="secondary" onClick={cancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Form"}
        </Button>
      </Box>
    </form>
  );
};

export default CreateForm;
