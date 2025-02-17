// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from '../app/nx-welcome';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FolderDetail from '../app/folders/FolderDetail';
import FolderManagement from './folders/FolderManagement';
import HistoryManagement from './history/HistoryManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<NxWelcome title="@nx-document-assignment/client" />}
        />
        <Route path="/folders" element={<FolderManagement />} />
        <Route path="/folders/:folderId" element={<FolderDetail />} />
        <Route path="/history" element={<HistoryManagement />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
