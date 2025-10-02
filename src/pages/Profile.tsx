import { Box, Typography } from "@mui/material";

const Profile = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Coming Soon
      </Typography>
    </Box>
  );
}

export default Profile