import React from 'react';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CloseOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';

import { BASE_API_URL } from '../../constants';
import { Document } from '../../interfaces';

interface Props {
  folderId: string;
  documentId: string;
}
export default function DocumentDetail({ folderId, documentId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [document, setDocument] = React.useState<Document>();

  const getDocument = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/documents/${documentId}`, {
        method: 'GET',
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
        const fetchedDocument: Document = await response.json();
        setDocument(fetchedDocument);
      }
    } catch (err) {
      console.log('Error fetching document:', err);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (documentId) {
      getDocument();
    }
  }, [documentId]);
  return (
    <div>
      {documentId && (
        <Tooltip title="View" placement="right">
          <IconButton onClick={handleClickOpen}>
            <RemoveRedEyeOutlined color="inherit" fontSize="medium" />
          </IconButton>
        </Tooltip>
      )}

      {document && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Tooltip title="Close">
              <CloseOutlined onClick={handleClose} className="closeBtn" />
            </Tooltip>
          </DialogTitle>
          <DialogContent sx={{ minWidth: 600 }}>
            <Box>
              <Box component="h2" mb={2} sx={{ textTransform: 'capitalize' }}>
                Title: {document?.title}
              </Box>
              <p>Content: {document?.content}</p>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{ display: 'flex', justifyContent: 'center', marginY: 1 }}
          >
            <Button
              size="medium"
              onClick={handleClose}
              variant="contained"
              style={{ borderRadius: '20px' }}
              color="inherit"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
