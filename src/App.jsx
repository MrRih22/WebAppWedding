import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import { Menu, X, Home, Wallet, CheckSquare, Users, Gift, Sparkles, Phone, PiggyBank, LogOut, Coins } from 'lucide-react';

// Komponen Menu Mobile (Garis Tiga) untuk Halaman yang Diproteksi
const MobileMenuWrapper = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    { id: '/', label: 'Dashboard', icon: Home },
    { id: '/budget', label: 'Keuangan', icon: Wallet },
    { id: '/tasks', label: 'Tugas', icon: CheckSquare },
    { id: '/guests', label: 'Tamu', icon: Users },
    { id: '/seserahan', label: 'Seserahan', icon: Gift },
    { id: '/mahar', label: 'Mahar', icon: Coins },
    { id: '/vendor', label: 'Vendor', icon: Sparkles },
    { id: '/contacts', label: 'Kontak', icon: Phone },
    { id: '/nabung', label: 'Tabungan', icon: PiggyBank },
  ];

  const handleLogout = () => {
    localStorage.removeItem('wedding_session');
    window.location.href = '/login';
  };

  return (
    <Layout>
      {children}

      {/* Pop-up Menu Garis Tiga (Mobile Navigation) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sage-900 text-base">Menu Navigasi</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>

            {/* Daftar Menu Grid */}
            <div className="grid grid-cols-2 gap-2">
              {menus.map((m) => {
                const isActive = location.pathname === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      navigate(m.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? 'bg-sage-500 text-white shadow-sm' : 'bg-gray-50 text-sage-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tombol Logout di dalam Popup */}
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 p-3 rounded-xl text-xs font-bold transition-colors"
            >
              <LogOut size={16} />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      )}

      {/* Bar Navigasi Melayang di Bawah Khusus HP */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 py-3 px-6 flex justify-center items-center z-40 shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-sage-500 text-white px-5 py-2.5 rounded-2xl shadow-md hover:bg-sage-900 transition-colors"
        >
          <Menu size={10} />
          <span className="text-xs font-bold">Menu</span>
        </button>
      </div>
    </Layout>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(WeddingContext);
  if (!user) return <Navigate to="/login" replace />;
  return <MobileMenuWrapper>{children}</MobileMenuWrapper>;
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
