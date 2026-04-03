import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BotBuilder from './pages/BotBuilder';
import Chat from './pages/Chat';

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bots/new" element={<BotBuilder />} />
        <Route path="bots/:id" element={<BotBuilder />} />
        <Route path="chat/:conversationId" element={<Chat />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
