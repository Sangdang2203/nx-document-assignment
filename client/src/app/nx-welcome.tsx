/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { toast } from 'react-toastify';
import { BASE_API_URL } from '../constants';
import TheFooterComponent from '../components/TheFooter';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import EventNoteIcon from '@mui/icons-material/EventNote';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
export function NxWelcome({ title }: { title: string }) {
  const [folders, serFolders] = React.useState([]);
  const [documents, setDocuments] = React.useState<number>(0);
  const [history, setHistory] = React.useState([]);

  // GET ALL FOLDER AND DOCUMENTS
  const getFolders = async () => {
    const response = await fetch(`${BASE_API_URL}/folders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      toast.error(response.statusText, {
        autoClose: 5000,
      });
    } else {
      const data = await response.json();
      serFolders(data);
      let totalDocuments = 0;
      data.forEach(async (folder: any) => {
        if (folder) {
          const response = await fetch(`${BASE_API_URL}/folders/${folder.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const folderData = await response.json();
            totalDocuments += folderData.length;
            // total documents
            setDocuments(totalDocuments);
          }
        }
      });
    }
  };

  // GET ALL HISTORY
  const getAllHistory = async () => {
    const response = await fetch(`${BASE_API_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      toast.error(response.statusText, {
        autoClose: 5000,
      });
    } else {
      const data = await response.json();
      setHistory(data);
    }
  };

  React.useEffect(() => {
    getFolders();
    getAllHistory();
  }, []);
  return (
    <>
      <section>
        <Container sx={{ marginTop: 4 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h4">Document Management System</Typography>
            </Toolbar>
          </AppBar>

          <Typography variant="body1" style={{ padding: '1rem 0' }}>
            Welcome to the document management system, which helps you organize,
            store and manage documents effectively and safely. Whether you are
            an individual or a business, the document management system will
            help you optimize the working process and improve productivity.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  padding: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  minHeight: 230,
                }}
              >
                <FolderIcon fontSize="large" color="primary" />
                <Typography variant="h5">Folders</Typography>
                <Typography variant="h2">{folders.length}</Typography>
                <Typography variant="body2">
                  Manage your folders effortlessly.
                </Typography>
                <Button variant="text" color="info" href="/folders">
                  More Detail
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  padding: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  minHeight: 230,
                }}
              >
                <DescriptionIcon fontSize="large" color="primary" />
                <Typography variant="h5">Documents</Typography>
                <Typography variant="h2">{documents}</Typography>
                <Typography variant="body2">
                  Keep track of your documents.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  padding: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  minHeight: 230,
                }}
              >
                <EventNoteIcon fontSize="large" color="primary" />
                <Typography variant="h5">Recently History</Typography>
                <Typography variant="h2">{history.length}</Typography>
                <Typography variant="body2">
                  Stay updated with recent activities.
                </Typography>
                <Button variant="text" color="info" href="/history">
                  More Detail
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </section>
      <footer style={{ display: 'flex', justifyContent: 'center' }}>
        <TheFooterComponent />
      </footer>
    </>
  );
}

export default NxWelcome;
