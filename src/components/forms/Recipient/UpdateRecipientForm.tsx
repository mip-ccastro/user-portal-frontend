import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Grid, Typography } from "@mui/material";
import FormTextField from "../../common/FormTextField";
import { useFetchRecipient, useUpdateRecipient } from "../../../hooks/useRecipient";
import { useSnackbar } from "../../../context/SnackBarContext";
import PhoneNumberField from "../../common/PhoneNumberField";
import { updateRecipient, type UpdateRecipientInput } from "../../../utils/validations/updateRecipient";
import Loading from "../../common/Loading";
import Error from "../../common/Error";

export type CreateTemplateFormProps = {
  cancel: () => void;
  isOpen: boolean;
  recipientId?: string
};

const UpdateRecipientForm = (props: CreateTemplateFormProps) => {
  const { cancel, isOpen, recipientId } = props;
  const { data, isPending: isLoading, isError } = useFetchRecipient(recipientId ?? "");
  const { mutateAsync, isPending } = useUpdateRecipient();
  const { showSnackbar } = useSnackbar();

  const form = useForm<UpdateRecipientInput>({
    resolver: zodResolver(updateRecipient),
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
    reset
  } = form;

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  useEffect(() => {
    if(!data) return
    reset({
      name: data.name,
      email: data.email,
      phone: data.phone
    })
  }, [data, reset])

  const onSubmit = async (data: UpdateRecipientInput) => {
    try {
      await mutateAsync({ recipientId: recipientId ?? "" , recipient: data });
      showSnackbar("Recipient updated successfully", "success");
    } catch (error) {
      console.error("Error updating recipient:", error);
      showSnackbar("Failed to update recipient", "error");
    } finally {
      form.reset();
      cancel();
    }
  };

  if(isLoading) return <Loading message="Loading..." />
  if(isError) return <Error />

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

export default UpdateRecipientForm;
