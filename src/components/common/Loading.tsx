import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  backdrop?: boolean;
  size?: number;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export default function Loading({
  message,
  fullScreen = false,
  backdrop = true, // Changed default to true for fullScreen
  size = 40,
  color = 'primary',
}: LoadingProps) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen || backdrop) {
    return (
      <Backdrop
        open={true}
        sx={{
          position: fullScreen ? 'fixed' : 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        {content}
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </Box>
  );
}