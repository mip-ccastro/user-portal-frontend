import React from "react";
import { useDeleteUser, useFetchUser } from "../../../hooks/useUser";
import { useSnackbar } from "../../../context/SnackBarContext";
import { Box, Button, Grid, Typography } from "@mui/material";

export type UpdateUserFormProps = {
  cancel: () => void;
  isOpen: boolean;
  userId?: string;
};

const DeleteUserForm = (props: UpdateUserFormProps) => {
  const { cancel, userId } = props ?? {};
  const { mutateAsync, isPending } = useDeleteUser();
  const {
    data: user,
    isPending: isLoading,
    isError,
  } = useFetchUser(userId ?? "");
  const { showSnackbar } = useSnackbar();

  const { first_name, last_name, email } = user ?? {}

  const onSubmit = async () => {
    try {
      await mutateAsync(userId ?? "");
      showSnackbar("User deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Failed to delete user", "error");
    } finally {
      cancel();
    }
  };

  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error</p>

  return (
    <Grid padding={1} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom component="p" align="center">
          Are you sure you want to delete this user?
        </Typography>
        <Typography variant="body1" gutterBottom component="p">
          Name: {first_name} {last_name}
        </Typography>
        <Typography variant="body1" gutterBottom component="p">
          Email: {email}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
        <Button variant="contained" color="secondary" onClick={cancel} disabled={isPending}>Cancel</Button>
        <Button variant="contained" color="primary" type="submit" onClick={onSubmit} disabled={isPending}>{isPending ? "Deleting..." : "Delete User"}</Button>
      </Box>
    </Grid>
  );
};

export default DeleteUserForm;
