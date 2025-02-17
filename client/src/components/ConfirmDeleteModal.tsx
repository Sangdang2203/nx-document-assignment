import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { BASE_API_URL } from '../constants';
import { toast } from 'react-toastify';

interface ConfirmDeleteModalProps {
  folderId?: string;
  documentId?: string;
  onDeleteSuccess: () => void;
}

export default function ConfirmDeleteModal({
  folderId,
  documentId,
  onDeleteSuccess,
}: ConfirmDeleteModalProps) {
  const [open, setOpen] = React.useState(false);

  // DELETE A FOLDER
  const handleDeleteFolder = async (folderId: string) => {
    const response = await fetch(`${BASE_API_URL}/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      toast.error(response.statusText, {
        autoClose: 5000,
      });
      handleClose();
    } else {
      toast.success('Item was deleted!', {
        autoClose: 5000,
      });
      onDeleteSuccess();
      handleClose();
    }
  };

  // DELETE A DOCUMENT
  const handleDeleteDocument = async (documentId: string) => {
    const response = await fetch(`${BASE_API_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      toast.error(response.statusText, {
        autoClose: 5000,
      });
      handleClose();
    } else {
      toast.success('Item was deleted!', {
        autoClose: 5000,
      });
      onDeleteSuccess();
      handleClose();
    }
  };

  const handleDelete = () => {
    if (folderId) {
      handleDeleteFolder(folderId);
    } else if (documentId) {
      handleDeleteDocument(documentId);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Tooltip title="Delete" placement="right">
        <IconButton onClick={handleClickOpen}>
          <DeleteIcon color="error" fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ textAlign: 'center' }}>
          <Typography maxWidth={350}>
            Are you sure you want to delete this item? This progress can not be
            undone.
          </Typography>
        </DialogTitle>
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'center', marginY: 1 }}
        >
          <Button
            size="medium"
            variant="contained"
            color="error"
            style={{ borderRadius: '20px' }}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            Delete
          </Button>
          <Button
            size="medium"
            variant="contained"
            color="inherit"
            style={{ borderRadius: '20px' }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
