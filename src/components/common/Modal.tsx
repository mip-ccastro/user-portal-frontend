import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";


const default_style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export interface ReusableModalProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  style?: React.CSSProperties;
}

export default function ReusableModal(props: ReusableModalProps) {
  const {
    title = "Modal Title",
    description,
    children,
    isOpen = false,
    handleClose,
    style = {},
  } = props;

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...default_style, ...style }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          {description && (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {description}
            </Typography>
          )}
          {children}
        </Box>
      </Modal>
    </div>
  );
}
