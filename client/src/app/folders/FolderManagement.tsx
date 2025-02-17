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

interface HeadCell {
  disablePadding: boolean;
  id: keyof Folder;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Folder
  ) => void;

  order: Order;
  orderBy: string;
  rowCount: number;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: '',
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Folder) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead sx={{ bgcolor: 'gainsboro' }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function FolderManagement() {
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [folders, setFolders] = React.useState<Folder[]>([]);
  const [filteredFolders, setFilteredFolders] = React.useState<Folder[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Folder>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Folder
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () =>
      [...filteredFolders]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredFolders, order, orderBy, page, rowsPerPage]
  );

  React.useEffect(() => {
    getFolders();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ m: 4 }}>
        Folder Management
      </Typography>
      <Paper sx={{ m: 4 }}>
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
          <FolderFormModal
            folders={filteredFolders}
            setFolders={setFilteredFolders}
            setPage={setPage}
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 550 }} id="table">
            <EnhancedTableHead
              numSelected={0}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredFolders.length}
            />
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                    <Loading />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {visibleRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center' }}>
                      No available data!
                    </TableCell>
                  </TableRow>
                )}
                {visibleRows.reverse().map((row) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        scope="row"
                        padding="normal"
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => navigation(`/folders/${row.id}`)}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell padding="normal" width={300}>
                        {row.type === 'folder' ? (
                          <Tooltip title="Folder">
                            <FolderIcon sx={{ color: '#ecd453' }} />
                          </Tooltip>
                        ) : (
                          <Description color="inherit" />
                        )}
                      </TableCell>
                      <TableCell padding="normal" width={50}>
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
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <BackButton />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFolders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );
}
