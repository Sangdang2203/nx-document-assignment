import { Stack } from '@mui/material';
import Pagination from '@mui/material/Pagination';

interface PaginationProps {
  data: unknown[];
  rowPerPage: number;
  page: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function PagingComponent({
  data,
  rowPerPage,
  page,
  onPageChange,
}: PaginationProps) {
  const count = Math.ceil(data.length / rowPerPage);
  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        page={page}
        onChange={onPageChange}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
