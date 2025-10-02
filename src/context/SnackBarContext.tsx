/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import ReusableSnackbar from '../components/common/ReusableSnackBar';
import type { AlertColor } from '@mui/material';

interface SnackbarContextProps {
  showSnackbar: (message: string, severity?: AlertColor, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const [duration, setDuration] = useState(4000);

  const showSnackbar = (msg: string, sev: AlertColor = 'success', dur = 4000) => {
    setMessage(msg);
    setSeverity(sev);
    setDuration(dur);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <ReusableSnackbar
        open={open}
        message={message}
        severity={severity}
        duration={duration}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
