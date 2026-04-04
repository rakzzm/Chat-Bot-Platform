import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BotList from './pages/BotList';
import BotBuilder from './pages/BotBuilder';
import VisualEditor from './pages/VisualEditor';
import Flows from './pages/Flows';
import Inbox from './pages/Inbox';
import Subscribers from './pages/Subscribers';
import NLU from './pages/NLU';
import KnowledgeBase from './pages/KnowledgeBase';
import ContextVariables from './pages/ContextVariables';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bots" element={<BotList />} />
        <Route path="bots/new" element={<BotBuilder />} />
        <Route path="bots/:id" element={<BotBuilder />} />
        <Route path="bots/:botId/editor" element={<VisualEditor />} />
        <Route path="flows" element={<Flows />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="nlu" element={<NLU />} />
        <Route path="knowledge" element={<KnowledgeBase />} />
        <Route path="context-variables" element={<ContextVariables />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
