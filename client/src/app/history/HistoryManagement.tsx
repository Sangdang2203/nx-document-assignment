import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableHead,
  TableSortLabel,
  Chip,
} from '@mui/material';
import moment from 'moment';
import DetailDocument from '../documents/DocumentDetail';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import { Order } from '../../methods';
import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import { BASE_API_URL } from '../../constants';
import { Document } from '../../interfaces';
import { EnhancedTableProps, HeadCell } from '../folders/FolderDetail';

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: '#',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
  },

  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created Date',
  },
  {
    id: 'folderId',
    numeric: false,
    disablePadding: false,
    label: 'Folder',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
];

function DocumentTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Document) => (event: React.MouseEvent<unknown>) => {
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

export default function HistoryManagement() {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Document>('title');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const fetchDocuments = async () => {
    const response = await fetch(`${BASE_API_URL}/history`, {
      method: 'GET',
      cache: 'no-cache',
    });
    const data = await response.json();
    if (response.ok) {
      setDocuments(data);
      setLoading(false);
    }
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Document
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

  React.useEffect(() => {
    fetchDocuments();
  }, []);
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ m: 4 }}>
        History Management
      </Typography>
      <Paper sx={{ m: 4 }}>
        <TableContainer>
          <Table sx={{ minWidth: 550 }} id="table">
            <DocumentTableHead
              numSelected={0}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={documents.length}
            />
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                    <Loading />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {documents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                      No available data!
                    </TableCell>
                  </TableRow>
                )}
                {documents.reverse().map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      tabIndex={-1}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="normal" width={300}>
                        {row.id}
                      </TableCell>

                      <TableCell padding="normal" width={500}>
                        {row.title}
                      </TableCell>

                      <TableCell padding="normal" width={150}>
                        {moment(row.createdAt).format('YYYY-MM-DD')}
                      </TableCell>

                      <TableCell padding="normal" width={300}>
                        {row.folderId}
                      </TableCell>

                      <TableCell padding="normal" width={50}>
                        {row.status ? (
                          <Chip
                            label="Added"
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          ''
                        )}
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
            count={documents.length}
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
