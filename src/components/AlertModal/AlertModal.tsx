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
  confirmLabel?: string;
  title?: string;
  message?: string;
  children?: React.ReactNode;
};

const AlertModal: FC<AlertModalProps> = ({
  open,
  onClose,
  confirmLabel,
  message,
  title,
  children
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <>
          {message && (
            <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
          )}
          {children}
        </>
      </DialogContent>
      <DialogActions>
        {confirmLabel && (
          <Button onClick={onClose} autoFocus>
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
