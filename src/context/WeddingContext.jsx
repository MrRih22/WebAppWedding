import React, { createContext, useState, useEffect } from 'react';

export const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  
  // --- 1. SISTEM SESI LOGIN (SESSION MANAGEMENT) ---
  const checkSession = () => {
    // Hapus sistem login versi lama agar tidak terjadi konflik
    localStorage.removeItem('wedding_user'); 
    
    // Ambil data sesi yang baru
    const sessionData = JSON.parse(localStorage.getItem('wedding_session'));
    
    if (sessionData) {
      const currentTime = new Date().getTime(); // Waktu saat ini (dalam milidetik)
      
      // Jika waktu saat ini MASIH KURANG DARI waktu kedaluwarsa
      if (currentTime < sessionData.expiry) {
        return sessionData.username;
      } else {
        // Jika sudah lewat (kedaluwarsa), hapus data sesi dari browser
        localStorage.removeItem('wedding_session');
      }
    }
    return null;
  };

  const [user, setUser] = useState(checkSession());
  
  // --- 2. DATA APLIKASI (TIDAK BERUBAH) ---
  const [budgets, setBudgets] = useState(() => JSON.parse(localStorage.getItem('wedding_budgets')) || []);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('wedding_tasks')) || []);
  const [guests, setGuests] = useState(() => JSON.parse(localStorage.getItem('wedding_guests')) || []);
  const [seserahan, setSeserahan] = useState(() => JSON.parse(localStorage.getItem('wedding_seserahan')) || []);
  const [mahar, setMahar] = useState(() => JSON.parse(localStorage.getItem('wedding_mahar')) || []);
  const [contacts, setContacts] = useState(() => JSON.parse(localStorage.getItem('wedding_contacts')) || []);
  const [rencanaDana, setRencanaDana] = useState(() => JSON.parse(localStorage.getItem('wedding_rencanaDana')) || 0);
  const [savings, setSavings] = useState(() => JSON.parse(localStorage.getItem('wedding_savings')) || []);
  
  // Auto-save data aplikasi (Kecuali sesi user, karena dihandle khusus)
  useEffect(() => { localStorage.setItem('wedding_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('wedding_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('wedding_guests', JSON.stringify(guests)); }, [guests]);
  useEffect(() => { localStorage.setItem('wedding_seserahan', JSON.stringify(seserahan)); }, [seserahan]);
  useEffect(() => { localStorage.setItem('wedding_mahar', JSON.stringify(mahar)); }, [mahar]);
  useEffect(() => { localStorage.setItem('wedding_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('wedding_rencanaDana', JSON.stringify(rencanaDana)); }, [rencanaDana]);
  useEffect(() => { localStorage.setItem('wedding_savings', JSON.stringify(savings)); }, [savings]);

  // --- 3. FUNGSI LOGIN & LOGOUT ---
  const login = (username, password) => {
    if ((username === 'Azzam' || username === 'Irma') && password === '060626') {
      
      // Atur batas waktu sesi: 24 Jam dari sekarang
      // Rumus: 24 jam * 60 menit * 60 detik * 1000 milidetik
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); 
      
      // Simpan username sekaligus waktu kedaluwarsanya
      localStorage.setItem('wedding_session', JSON.stringify({
        username: username,
        expiry: expiryTime
      }));
      
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('wedding_session');
    setUser(null);
  };

  // --- 4. KALKULATOR DASHBOARD (TIDAK BERUBAH) ---
  const totalTabungan = savings.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);
  const totalDibayar = budgets.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0);
  const danaTerkumpul = totalTabungan + totalDibayar;

  const calculateProgress = () => {
    let totalPercentage = 0; let activeParams = 0;
    if (tasks.length > 0) { totalPercentage += (tasks.filter(t => t.status === 'Selesai').length / tasks.length) * 100; activeParams++; }
    if (budgets.length > 0) { totalPercentage += (budgets.filter(b => b.isLunas).length / budgets.length) * 100; activeParams++; }
    if (guests.length > 0) { totalPercentage += (guests.filter(g => g.status === 'Sudah Dikirim').length / guests.length) * 100; activeParams++; }
    if (seserahan.length > 0) { totalPercentage += (seserahan.filter(s => s.status === 'Sudah').length / seserahan.length) * 100; activeParams++; }
    if (mahar.length > 0) { totalPercentage += (mahar.filter(m => m.status === 'Sudah').length / mahar.length) * 100; activeParams++; }
    
    if (Number(rencanaDana) > 0) { 
      totalPercentage += (Math.min(danaTerkumpul / Number(rencanaDana), 1)) * 100; 
      activeParams++; 
    }
    
    return activeParams === 0 ? 0 : Math.round(totalPercentage / activeParams);
  };

  return (
    <WeddingContext.Provider value={{
      user, login, logout,
      budgets, setBudgets, tasks, setTasks,
      guests, setGuests, seserahan, setSeserahan,
      mahar, setMahar, contacts, setContacts,
      rencanaDana, setRencanaDana, 
      savings, setSavings, danaTerkumpul,
      overallProgress: calculateProgress()
    }}>
      {children}
    </WeddingContext.Provider>
  );
};
