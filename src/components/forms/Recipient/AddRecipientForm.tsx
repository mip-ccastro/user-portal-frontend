import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  addRecipient,
  type AddRecipientInput,
} from "../../../utils/validations/addRecipient";
import { Box, Button, Grid, Typography } from "@mui/material";
import FormTextField from "../../common/FormTextField";
import { useAddRecipient } from "../../../hooks/useRecipient";
import { useSnackbar } from "../../../context/SnackBarContext";
import PhoneNumberField from "../../common/PhoneNumberField";

export type CreateTemplateFormProps = {
  cancel: () => void;
  isOpen: boolean;
};

const AddRecipientForm = (props: CreateTemplateFormProps) => {
  const { cancel, isOpen } = props;
  const { mutateAsync, isPending } = useAddRecipient()
  const { showSnackbar } = useSnackbar();

  const form = useForm<AddRecipientInput>({
    resolver: zodResolver(addRecipient),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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

  const onSubmit = async (data: AddRecipientInput) => {
    try {
      await mutateAsync(data);
       showSnackbar("Recipient added successfully", "success");
    } catch (error) {
      console.error("Error adding recipient:", error);
      showSnackbar("Failed to add recipient", "error");
    } finally {
      form.reset();
      cancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid padding={1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
        <Typography variant="h6" gutterBottom component="p">
          Recipient Details
        </Typography>
        <Grid container direction={"row"} spacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <FormTextField
              name="name"
              label="Name"
              control={control}
              required
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <FormTextField
              name="email"
              label="Email"
              control={control}
              required
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <PhoneNumberField
              control={control}
              name="phone"
              label="Phone Number"
              required
            />
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 1 }}>
        <Button variant="contained" color="secondary" onClick={cancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Recipient"}
        </Button>
      </Box>
    </form>
  );
};

export default AddRecipientForm;
