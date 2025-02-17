import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Input,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Search, Description } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';

import { Folder } from '../../interfaces';
import { BASE_API_URL } from '../../constants';
import { getComparator, Order } from '../../methods';
import Loading from '../../components/Loading';
import FolderFormModal from './FolderFormModal';
import BackButton from '../../components/BackButton';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';

export default function FolderManagement() {
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [folders, setFolders] = React.useState<Folder[]>([]);
  const [filteredFolders, setFilteredFolders] = React.useState<Folder[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Folder>('name');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigation = useNavigate();

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

  const visibleRows = React.useMemo(
    () => [...filteredFolders].sort(getComparator(order, orderBy)),
    [filteredFolders, order, orderBy]
  );

  React.useEffect(() => {
    getFolders();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ m: 4 }}>
        Folder Management
      </Typography>
      <Paper sx={{ m: 4, minHeight: 600 }}>
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
          <div>
            {visibleRows.length === 0 && (
              <Typography sx={{ textAlign: 'center' }}>
                No available data!
              </Typography>
            )}
            {visibleRows.reverse().map((row, index) => {
              if (index % 5 === 0) {
                return (
                  <div
                    key={row.id}
                    style={{
                      display: 'flex',
                      padding: 10,
                    }}
                  >
                    {visibleRows.slice(index, index + 5).map((folder) => (
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
                          <MoreVertSharpIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
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
                            <Tooltip title="Press icon to delete">
                              <p>Delete</p>
                            </Tooltip>
                          </MenuItem>
                        </Menu>

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
      </Paper>
    </Box>
  );
}
