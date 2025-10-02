import { styled } from '@mui/material/styles';
import { X } from 'lucide-react';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface ReusableModalProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  width?: number | string; // Accept width prop
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false; // MUI maxWidth options
}

export default function ReusableModal(props: ReusableModalProps) {
  const {
    title = "Modal Title",
    children,
    isOpen = false,
    handleClose,
    width = 600,
    maxWidth = false,
  } = props;

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      maxWidth={maxWidth}
      fullWidth={maxWidth !== false}
      PaperProps={{
        sx: {
          width: width,
          maxWidth: maxWidth === false ? width : undefined,
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <X />
      </IconButton>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </BootstrapDialog>
  );
}