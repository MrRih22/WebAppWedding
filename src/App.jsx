import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WeddingProvider, WeddingContext } from './context/WeddingContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BudgetManager from './pages/BudgetManager';
import TaskTracker from './pages/TaskTracker';
import GuestList from './pages/GuestList';
import Seserahan from './pages/Seserahan';
import Mahar from './pages/Mahar';
import ContactInfo from './pages/ContactInfo';
import Nabung from './pages/Nabung';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(WeddingContext);
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <WeddingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><BudgetManager /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TaskTracker /></ProtectedRoute>} />
          <Route path="/guests" element={<ProtectedRoute><GuestList /></ProtectedRoute>} />
          <Route path="/seserahan" element={<ProtectedRoute><Seserahan /></ProtectedRoute>} />
          <Route path="/mahar" element={<ProtectedRoute><Mahar /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><ContactInfo /></ProtectedRoute>} />
          <Route path="/nabung" element={<ProtectedRoute><Nabung /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WeddingProvider>
  );
}