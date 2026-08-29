import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeddingContext } from '../context/WeddingContext';
import { Heart } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(WeddingContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/');
    } else {
      setError('Ettt Salahh Password Nya Coyy !!!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-sage-100">
        <div className="flex justify-center mb-6 text-sage-500">
          <Heart size={48} className="animate-pulse" />
        </div>
        <h1 className="text-3xl font-serif text-center text-sage-900 mb-2">Rasyid & Irma</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Wedding Planner Dashboard</p>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sage-900 mb-1">Username</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:outline-none transition-all"
              value={username} onChange={(e) => setUsername(e.target.value)} required
            >
              <option value="" disabled>Pilih Pengguna...</option>
              <option value="Azzam">Azzam</option>
              <option value="Irma">Irma</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-900 mb-1">Password</label>
            <input 
              type="password" placeholder="••••••"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:outline-none transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <button type="submit" className="w-full bg-sage-500 text-white p-3 rounded-lg hover:bg-sage-900 transition-colors font-medium mt-6 shadow-md">
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
