import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Container,
} from "@mui/material";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import {
  loginSchema,
  type LoginFormData,
} from "../utils/validations/loginSchema";
import { useAuthContext } from "../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { useLogin } from "../hooks/useAuthHook";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Grid from "@mui/material/Grid";
import peopleImage from "../assets/people.svg";
import { navigateTo } from "../services/navigateService";
import { useSnackbar } from "../context/SnackBarContext";
import Loading from "../components/common/Loading";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checkingAuth, isCheckingAuth] = useState(false);
  const { mutateAsync, isPending } = useLogin();
  const { login } = useAuthContext();
  const { showSnackbar } = useSnackbar();
  const { checkAuth } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await mutateAsync(data);
      const {
        access_token,
        refresh_token,
        id_token,
        data: user,
        status,
      } = response;

      if (status === 200 && access_token && refresh_token && id_token && user) {
        login(user, access_token, refresh_token, id_token);
        showSnackbar(`Successfully logged in!`, "success");
        navigateTo("/");
      }
    } catch (error) {
      setLoginError("Invalid username or password");
      showSnackbar("Invalid username or password", "error");
      console.error("Login error:", error);
    } finally {
      setLoginError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    isCheckingAuth(true);
    checkAuth();
    isCheckingAuth(false);
  }, [checkAuth]);

  if (checkingAuth) {
    return <Loading fullScreen message="Loading" />;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
      <Grid container spacing={4} alignItems="center" width={"100%"}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ maxWidth: 450 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              align="center"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4 }}
              align="center"
            >
              Please login to your account
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {loginError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      type="text"
                      fullWidth
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <User size={20} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock size={20} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {showPassword ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />

                {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Forgot Password?
                    </Typography>
                  </Box> */}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isPending}
                  sx={{ py: 1.5, textTransform: "none", fontSize: 16 }}
                >
                  {isPending ? "Logging in..." : "Login"}
                </Button>

                {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Typography
                        component="span"
                        color="primary"
                        sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                      >
                        Sign Up
                      </Typography>
                    </Typography>
                  </Box> */}
              </Box>
            </form>
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          <Paper
            elevation={0}
            sx={{
              height: 500,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "white",
              p: 4,
            }}
          >
            <Box
              sx={{
                width: 600,
                height: 600,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={peopleImage}
                alt="Logo"
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              User Portal
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginPage;
