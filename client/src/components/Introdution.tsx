import { Container, Typography } from '@mui/material';

export default function Introduction() {
  return (
    <Container sx={{ padding: 4 }}>
      <Typography variant="body1">
        Welcome to the document management system, which helps you organize,
        store and manage documents effectively and safely.Whether you are an
        individual or business, the document management system will help you
        optimize the working process and improve productivity.
      </Typography>
    </Container>
  );
}
