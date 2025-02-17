/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  CloseOutlined,
  ControlPoint,
  EditNoteOutlined,
} from '@mui/icons-material';

import {
  Button,
  Dialog,
  DialogTitle,
  Tooltip,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { Document } from '../../interfaces';
import { generateId } from '../../methods';
import { BASE_API_URL } from '../../constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ContentEditor from '../../components/ContentEditor';

interface Props {
  documents: Document[];
  folderId: string;
  documentId: string;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onCreated: () => void;
  onUpdated: () => void;
}

export default function DocumentFormModal({
  folderId,
  documentId,
  documents,
  setDocuments,
  setPage,
  onCreated,
  onUpdated,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [document, setDocument] = React.useState<Document>();

  const documentSchema = z.object({
    title: z
      .string({ message: 'Document title is required.' })
      .regex(/^[A-Za-z0-9 _-]+$/, {
        message: 'Title can only contain letters, numbers, spaces, (-), (_).',
      })
      .min(5, { message: 'Title must be at least 5 letters.' })
      .max(50, { message: 'Title must be less than 50 letters.' })
      .refine(
        (title) => {
          if (documentId) {
            return !documents.some(
              (doc) => doc.title === title && doc.id !== documentId
            );
          }
          return !documents.some((doc) => doc.title === title);
        },
        {
          message: 'Document title already exists',
        }
      ),
    content: z
      .string({ message: 'Content is required.' })
      .min(1, { message: 'Content is required' }),
  });

  type FormData = z.infer<typeof documentSchema>;

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(documentSchema),
  });

  // GET DOCUMENT
  const getDocument = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/documents/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      const fetchedDocument: Document = await response.json();
      setDocument(fetchedDocument);
      reset({
        title: fetchedDocument.title,
        content: fetchedDocument.content,
      });
    } catch (err) {
      console.log('Error fetching document:', err);
    }
  };

  // CREATE NEW DOCUMENT
  const handleCreateDocument: SubmitHandler<FormData> = async (data) => {
    const newDocument: Document = {
      id: generateId(),
      folderId: folderId,
      title: data.title,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'added',
    };

    try {
      const response = await fetch(`${BASE_API_URL}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocument),
      });

      if (!response.ok) {
        toast.error(response.statusText, {
          autoClose: 5000,
        });
        handleClose();
      } else {
        const createdDocument: Document = await response.json();

        await fetch(`${BASE_API_URL}/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: createdDocument.id,
            folderId: folderId,
            title: createdDocument.title,
            status: 'added',
            timestamp: new Date(),
          }),
        });

        setDocuments((preDocuments) => [createdDocument, ...preDocuments]);
        toast.success(
          'Document was created and added into the history successfully.',
          {
            autoClose: 5000,
          }
        );
        handleClose();
        onCreated();
        setPage(0);
        handleClose();
        reset();
      }
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  // UPDATE EXISTING DOCUMENT
  const handleUpdateDocument: SubmitHandler<FormData> = async (data) => {
    const updatedDocument: Document = {
      id: documentId,
      folderId: folderId,
      title: data.title,
      content: data.content,
      createdAt: document!.createdAt,
      updatedAt: new Date(),
      status: 'updated',
    };

    try {
      const response = await fetch(`${BASE_API_URL}/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDocument),
      });

      if (!response.ok) {
        toast.error(response.statusText, {
          autoClose: 5000,
        });
        handleClose();
      } else {
        const updatedDoc: Document = await response.json();
        const updatedDocuments = documents.map((doc) =>
          doc.id === documentId ? updatedDoc : doc
        );

        setDocuments(updatedDocuments);
        toast.success('Document was updated successfully.', {
          autoClose: 5000,
        });
        onUpdated();
        handleClose();
        reset();
      }
    } catch (err) {
      console.error('Error updating document:', err);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  React.useEffect(() => {
    if (documentId) {
      getDocument();
    }
  }, [documentId]);

  return (
    <div>
      {documentId ? (
        <Tooltip title="Edit" placement="right">
          <IconButton onClick={handleClickOpen}>
            <EditNoteOutlined color="success" fontSize="medium" />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          onClick={handleClickOpen}
          variant="contained"
          startIcon={<ControlPoint />}
        >
          New
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Tooltip title="Close">
            <CloseOutlined onClick={handleClose} className="closeBtn" />
          </Tooltip>
          {documentId ? 'Update Document Information' : 'Create New Document'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 600 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ''}
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                defaultValue={document ? document.title : ''}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div style={{ margin: '8px 0' }}>
                <ContentEditor
                  onChange={field.onChange}
                  value={document ? document.content : field.value || ''}
                />
                <FormHelperText
                  style={{ color: '#d32f2f', paddingLeft: '14px' }}
                >
                  {errors.content ? errors.content.message : ''}
                </FormHelperText>
              </div>
            )}
          />
        </DialogContent>
        <DialogActions
          sx={{ display: 'flex', justifyContent: 'center', marginY: 1 }}
        >
          <Button
            size="medium"
            onClick={handleSubmit((data) => {
              if (documentId) {
                handleUpdateDocument(data);
              } else {
                handleCreateDocument(data);
              }
            })}
            variant="contained"
            color="primary"
            style={{ borderRadius: '20px' }}
          >
            {documentId ? 'Update' : 'Create'}
          </Button>
          <Button
            size="medium"
            onClick={handleClose}
            variant="contained"
            style={{ borderRadius: '20px' }}
            color="inherit"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
