import * as React from 'react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Document } from '../../interfaces';
import {
  Box,
  IconButton,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Search } from '@mui/icons-material';
import { BASE_API_URL } from '../../constants';
import { getComparator, Order } from '../../methods';

import Loading from '../../components/Loading';
import BackButton from '../../components/BackButton';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import DocumentFormModal from '../documents/DocumentFormModal';
import DetailDocument from '../documents/DocumentDetail';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Document;
  label: string;
  numeric: boolean;
}

export interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Document
  ) => void;

  order: Order;
  orderBy: string;
  rowCount: number;
}

const headCells: readonly HeadCell[] = [
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
    id: 'updatedAt',
    numeric: false,
    disablePadding: false,
    label: 'Update Date',
  },
  {
    id: 'folderId',
    numeric: false,
    disablePadding: false,
    label: '',
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

export default function FolderDetail() {
  const { folderId } = useParams<{ folderId: string }>();
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredDocuments, setFilteredDocuments] = React.useState<Document[]>(
    []
  );
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Document>('title');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // GET DOCUMENTS VIA FolderId
  const fetchDocuments = async () => {
    const response = await fetch(`${BASE_API_URL}/folders/${folderId}`, {
      method: 'GET',
      cache: 'no-cache',
    });
    const data = await response.json();
    if (response.ok) {
      setDocuments(data);
      setFilteredDocuments(data);
      setLoading(false);
    }
  };

  // SEARCH DOCUMENTS VIA ITS TITLE
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setFilteredDocuments(documents);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_API_URL}/search?query=${encodeURIComponent(searchTerm)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFilteredDocuments(data);
      } else {
        console.error('Error fetching search results:', response.statusText);
      }
    } catch (error) {
      console.error('Error during search:', error);
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

  const visibleRows = React.useMemo(
    () =>
      [...filteredDocuments]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredDocuments, order, orderBy, page, rowsPerPage]
  );

  React.useEffect(() => {
    fetchDocuments();
  }, [folderId]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ m: 4 }}>
        Documents in folder
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
              placeholder="Enter title to search"
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
          <DocumentFormModal
            folderId={folderId ?? ''}
            documents={filteredDocuments}
            setDocuments={setDocuments}
            setPage={setPage}
            documentId={''}
            onCreated={fetchDocuments}
            onUpdated={fetchDocuments}
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 550 }} id="table">
            <DocumentTableHead
              numSelected={0}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredDocuments.length}
            />
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                    <Loading />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {visibleRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
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
                        padding="normal"
                        width={300}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {row.title}
                      </TableCell>

                      {/* <TableCell padding="normal" width={500}>
                        <MarkdownRenderer content={row.content} />
                      </TableCell> */}

                      <TableCell padding="normal" width={150}>
                        {moment(row.createdAt).format('YYYY-MM-DD')}
                      </TableCell>

                      <TableCell padding="normal" width={150}>
                        {moment(row.updatedAt).format('YYYY-MM-DD')}
                      </TableCell>

                      <TableCell padding="normal" width={50}>
                        <DetailDocument folderId={''} documentId={row.id} />

                        <DocumentFormModal
                          folderId={''}
                          documents={filteredDocuments}
                          setDocuments={setDocuments}
                          setPage={setPage}
                          documentId={row.id}
                          onCreated={fetchDocuments}
                          onUpdated={fetchDocuments}
                        />

                        <ConfirmDeleteModal
                          folderId={''}
                          documentId={row.id}
                          onDeleteSuccess={() => {
                            setDocuments((pre) =>
                              pre.filter((doc) => doc.id !== row.id)
                            );
                            setFilteredDocuments((pre) =>
                              pre.filter((doc) => doc.id !== row.id)
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
            count={filteredDocuments.length}
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
