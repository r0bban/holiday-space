import React, { FC } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

type AlertModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

const AlertModal: FC<AlertModalProps> = ({ open, onClose, message, title }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
