import React from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';

interface ReusableSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'success' | 'error' | 'info' | 'warning'
  duration?: number;
  onClose: () => void;
}

const ReusableSnackbar: React.FC<ReusableSnackbarProps> = ({
  open,
  message,
  severity = 'success',
  duration = 4000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ReusableSnackbar;
