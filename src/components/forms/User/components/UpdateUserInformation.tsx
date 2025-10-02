import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import FormTextField from "../../../common/FormTextField";
import PasswordTextField from "../../../common/PasswordTextField";
import type { UpdateUserFormProps } from "../../../../utils/types/users";

const UpdateUserInformation: React.FC<UpdateUserFormProps> = ({ form }) => {
  const {
    control,
    formState: { errors },
  } = form;

  const { username, email, user_role, first_name, last_name, user_status } =
    form.getValues();

  const roles = ["Admin", "User"];
  const user_statuses = [
    {
      value: 1,
      label: "Active",
    },
    {
      value: 0,
      label: "Inactive",
    },
    {
      value: 2,
      label: "Suspended",
    },
  ];

  return (
    <Grid padding={1} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom component="p">
          User Status
        </Typography>
        <Grid container direction={"row"} spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <Controller
              name="user_status"
              control={control}
              defaultValue={user_status}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="User Status"
                  fullWidth
                  required
                  size="small"
                  margin="dense"
                  error={!!errors.user_status}
                  helperText={errors.user_status?.message}
                  sx={{
                    "& .MuiFormLabel-asterisk": {
                      color: "error.main",
                    },
                  }}
                >
                  {user_statuses.map((status, index) => (
                    <MenuItem key={index} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom component="p">
          User Credentials
        </Typography>
        <Grid container direction={"row"} spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <FormTextField
              name="username"
              label="Username"
              control={control}
              defaultValue={username}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <PasswordTextField
              name="password"
              label="Password"
              control={control}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom component="p">
          User Information
        </Typography>
        <Grid container direction={"column"}>
          <Grid container direction={"row"} spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <FormTextField
                name="first_name"
                label="First Name"
                control={control}
                defaultValue={first_name}
                required
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <FormTextField
                name="last_name"
                label="Last Name"
                control={control}
                defaultValue={last_name}
                required
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid>
          </Grid>
          <Grid container direction={"row"} spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <FormTextField
                name="email"
                label="Email"
                control={control}
                defaultValue={email}
                required
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <Controller
                name="user_role"
                control={control}
                defaultValue={user_role}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="User Role"
                    fullWidth
                    required
                    size="small"
                    margin="dense"
                    error={!!errors.user_role}
                    helperText={errors.user_role?.message}
                    sx={{
                      "& .MuiFormLabel-asterisk": {
                        color: "error.main",
                      },
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role.toLowerCase()}>
                        {role}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default UpdateUserInformation;
