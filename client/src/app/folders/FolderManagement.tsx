import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Paper,
  Input,
  Typography,
  MenuItem,
  Divider,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';

import { Folder } from '../../interfaces';
import { BASE_API_URL } from '../../constants';
import Loading from '../../components/Loading';
import FolderFormModal from './FolderFormModal';
import StyledMenu from '../../components/StyleMenu';
import BackButton from '../../components/BackButton';
import PagingComponent from '../../components/Pagination';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

export default function FolderManagement() {
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [folders, setFolders] = React.useState<Folder[]>([]);
  const [filteredFolders, setFilteredFolders] = React.useState<Folder[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [foldersPerPage] = React.useState(25);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigation = useNavigate();
  const indexOfLast = currentPage * foldersPerPage;
  const indexOfFirst = indexOfLast - foldersPerPage;
  const currentProjects = filteredFolders.slice(indexOfFirst, indexOfLast);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFolders = async () => {
    const response = await fetch(`${BASE_API_URL}/folders`, {
      method: 'GET',
      cache: 'no-cache',
    });

    const data = await response.json();
    if (response.ok) {
      setLoading(false);
      setFolders(data);
      setFilteredFolders(data);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredFolders(folders);
    } else {
      const filteredData = folders.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFolders(filteredData);
    }
  };

  React.useEffect(() => {
    getFolders();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ m: 4, minHeight: '90vh' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <Input
              placeholder="Enter name to search"
              sx={{ minWidth: 300 }}
              size="small"
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="submit" title="Press to search">
              <Search color="success" />
            </IconButton>
          </form>
          <div style={{ display: 'flex' }}>
            <BackButton />
            <FolderFormModal
              folders={filteredFolders}
              setFolders={setFilteredFolders}
            />
          </div>
        </Box>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Loading />
          </div>
        ) : (
          //list of folders
          <div>
            {currentProjects.length === 0 && (
              <Typography sx={{ textAlign: 'center' }}>
                No available data!
              </Typography>
            )}
            {currentProjects.reverse().map((row, index) => {
              if (index % 5 === 0) {
                return (
                  <div
                    key={row.id}
                    style={{
                      display: 'flex',
                      padding: 10,
                    }}
                  >
                    {currentProjects.slice(index, index + 5).map((folder) => (
                      <div
                        key={folder.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'start',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '10px',
                          margin: '5px',
                          flex: 1,
                        }}
                        title={`Go to the ${folder.name} folder`}
                      >
                        <IconButton title="Actions" onClick={handleClick}>
                          <MoreVertSharpIcon color="inherit" />
                        </IconButton>
                        <StyledMenu
                          id="menu-actions"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                        >
                          <MenuItem
                            onClick={() => navigation(`/folders/${folder.id}`)}
                            sx={{ maxHeight: 40 }}
                            disableRipple
                          >
                            <FolderOpenIcon />
                            <p>Open</p>
                          </MenuItem>
                          <MenuItem sx={{ maxHeight: 40 }} disableRipple>
                            <DriveFileRenameOutlineIcon />
                            <p>Rename</p>
                          </MenuItem>
                          <MenuItem disableRipple>
                            <ConfirmDeleteModal
                              folderId={row.id}
                              documentId={''}
                              onDeleteSuccess={() => {
                                setFolders((prevFolders) =>
                                  prevFolders.filter(
                                    (folder) => folder.id !== row.id
                                  )
                                );
                                setFilteredFolders((prevFolders) =>
                                  prevFolders.filter(
                                    (folder) => folder.id !== row.id
                                  )
                                );
                                handleClose();
                              }}
                            />
                          </MenuItem>
                          <Divider sx={{ my: 0.5 }} />
                        </StyledMenu>

                        <div
                          style={{ display: 'flex', alignItems: 'center' }}
                          onClick={() => navigation(`/folders/${folder.id}`)}
                        >
                          <FolderIcon
                            color="info"
                            fontSize="large"
                            sx={{ mx: 1 }}
                          />
                          {folder.name}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        {/* Paging */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            marginY: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <PagingComponent
            data={folders}
            rowPerPage={foldersPerPage}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        </Box>
      </Paper>
    </Box>
  );
}
