'use client';
import { CloseOutlined, ControlPoint } from '@mui/icons-material';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { Folder } from '../../interfaces';
import { toast } from 'react-toastify';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateId } from '../../methods';
import { BASE_API_URL } from '../../constants';

interface Props {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
}

export default function FolderFormModal({ folders, setFolders }: Props) {
  const [open, setOpen] = React.useState(false);

  const folderSchema = z.object({
    folderName: z
      .string({ message: 'Folder name is required.' })
      .min(1, { message: 'Name must be at least a letter.' })
      .max(20, { message: 'Name must be less than 20 letters.' })
      .regex(/^[A-Za-z0-9 _-]+$/, {
        message: 'Name can only contain letters, numbers, spaces, (-), (_).',
      })
      .refine(
        (name) =>
          !folders.some(
            (folder) =>
              folder.name.trim().toLowerCase() === name.trim().toLowerCase()
          ),
        {
          message: 'Folder name already exists',
        }
      ),
  });

  type FormData = z.infer<typeof folderSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(folderSchema),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateFolder: SubmitHandler<FormData> = async (data) => {
    const newFolder: Folder = {
      id: generateId(),
      name: data.folderName,
      type: 'folder',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const response = await fetch(`${BASE_API_URL}/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFolder),
    });

    if (!response.ok) {
      toast.error(response.statusText, {
        autoClose: 5000,
      });
      handleClose();
    } else {
      const createdFolder: Folder = await response.json();
      setFolders((prevFolders) => [createdFolder, ...prevFolders]);
      toast.success('Folder was created successfully!', {
        autoClose: 5000,
      });
      handleClose();
    }
  };

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        startIcon={<ControlPoint />}
      >
        New
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Tooltip title="Close">
            <CloseOutlined onClick={handleClose} className="closeBtn" />
          </Tooltip>
          Create New Folder
        </DialogTitle>

        <DialogContent sx={{ minWidth: 400 }}>
          <Controller
            name="folderName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.folderName}
                helperText={errors.folderName ? errors.folderName.message : ''}
                autoFocus
                defaultValue=""
                margin="dense"
                id="folderName"
                label="Folder Name"
                type="text"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size="medium"
            onClick={handleSubmit(handleCreateFolder)}
            variant="contained"
            color="primary"
            style={{ borderRadius: '20px' }}
          >
            Create
          </Button>
          <Button
            size="medium"
            onClick={handleClose}
            variant="outlined"
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
