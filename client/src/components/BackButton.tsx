import UndoIcon from '@mui/icons-material/Undo';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function BackButton() {
  const navigate = useNavigate();
  const handleClickBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <IconButton title="Back" onClick={handleClickBack}>
        <UndoIcon color="info" />
      </IconButton>
    </div>
  );
}
