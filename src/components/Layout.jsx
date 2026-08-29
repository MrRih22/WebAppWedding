import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WeddingContext } from '../context/WeddingContext';
import { LayoutDashboard, Wallet, CheckSquare, Users, Gift, Gem, Phone, PiggyBank, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout, overallProgress } = useContext(WeddingContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Budget', path: '/budget', icon: <Wallet size={20} /> },
    { name: 'Tugas', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Tamu', path: '/guests', icon: <Users size={20} /> },
    { name: 'Seserahan', path: '/seserahan', icon: <Gift size={20} /> },
    { name: 'Mahar', path: '/mahar', icon: <Gem size={20} /> },
    { name: 'Kontak', path: '/contacts', icon: <Phone size={20} /> },
    { name: 'Nabung', path: '/nabung', icon: <PiggyBank size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-pastel flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-white border-r border-sage-100 flex flex-col justify-between fixed md:relative z-10 bottom-0 md:bottom-auto">
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-serif text-sage-900">Rasyid & Irma Wedding Planner</h2>
          <p className="text-sm text-gray-400 mt-1">Welcome, {user}</p>
        </div>
        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all whitespace-nowrap ${location.pathname === item.path ? 'bg-sage-500 text-white shadow-md' : 'text-sage-900 hover:bg-sage-50'}`}>
              {item.icon} <span className="hidden md:inline font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 hidden md:block">
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors">
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 w-full overflow-x-hidden">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage-50 mb-8">
          <div className="flex justify-between items-end mb-2">
            <div><h3 className="text-lg font-bold text-sage-900">Kesiapan Rencana Wedding</h3></div>
            <span className="text-2xl font-serif text-gold-500">{overallProgress}%</span>
          </div>
          <div className="w-full bg-sage-100 rounded-full h-3">
            <div className="bg-gold-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>
        <div className="animate-in fade-in duration-500">{children}</div>
      </main>
    </div>
  );
}
