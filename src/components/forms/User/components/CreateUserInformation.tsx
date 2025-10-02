import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import FormTextField from "../../../common/FormTextField";
import PasswordTextField from "../../../common/PasswordTextField";
import type { CreateUserFormProps } from "../../../../utils/types/users";

const CreateUserInformation: React.FC<CreateUserFormProps> = ({ form }) => {
  const {
    control,
    formState: { errors },
  } = form;

  const roles = ["Admin", "User"];

  return (
    <Grid padding={1} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
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
              required
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <PasswordTextField name="password" label="Password" control={control} required />
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
                required
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <Controller
                name="user_role"
                control={control}
                defaultValue=""
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

export default CreateUserInformation;
