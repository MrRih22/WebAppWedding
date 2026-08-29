import React, { createContext, useState, useEffect } from 'react';

export const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('wedding_user')) || null);
  
  const [budgets, setBudgets] = useState(() => JSON.parse(localStorage.getItem('wedding_budgets')) || []);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('wedding_tasks')) || []);
  const [guests, setGuests] = useState(() => JSON.parse(localStorage.getItem('wedding_guests')) || []);
  const [seserahan, setSeserahan] = useState(() => JSON.parse(localStorage.getItem('wedding_seserahan')) || []);
  const [mahar, setMahar] = useState(() => JSON.parse(localStorage.getItem('wedding_mahar')) || []);
  const [contacts, setContacts] = useState(() => JSON.parse(localStorage.getItem('wedding_contacts')) || []);
  
  const [rencanaDana, setRencanaDana] = useState(() => JSON.parse(localStorage.getItem('wedding_rencanaDana')) || 0);
  const [savings, setSavings] = useState(() => JSON.parse(localStorage.getItem('wedding_savings')) || []);
  
  useEffect(() => { localStorage.setItem('wedding_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('wedding_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('wedding_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('wedding_guests', JSON.stringify(guests)); }, [guests]);
  useEffect(() => { localStorage.setItem('wedding_seserahan', JSON.stringify(seserahan)); }, [seserahan]);
  useEffect(() => { localStorage.setItem('wedding_mahar', JSON.stringify(mahar)); }, [mahar]);
  useEffect(() => { localStorage.setItem('wedding_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('wedding_rencanaDana', JSON.stringify(rencanaDana)); }, [rencanaDana]);
  useEffect(() => { localStorage.setItem('wedding_savings', JSON.stringify(savings)); }, [savings]);

  const login = (username, password) => {
    if ((username === 'Azzam' || username === 'Irma') && password === '060626') {
      setUser(username); return true;
    }
    return false;
  };
  const logout = () => setUser(null);

  // --- RUMUS BARU SESUAI LOGIKA ANDA ---
  const totalTabungan = savings.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);
  const totalDibayar = budgets.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0);
  
  // Dana Terkumpul = Tabungan + Budget yang Telah Dibayar
  const danaTerkumpul = totalTabungan + totalDibayar;

  const calculateProgress = () => {
    let totalPercentage = 0; let activeParams = 0;
    if (tasks.length > 0) { totalPercentage += (tasks.filter(t => t.status === 'Selesai').length / tasks.length) * 100; activeParams++; }
    if (budgets.length > 0) { totalPercentage += (budgets.filter(b => b.isLunas).length / budgets.length) * 100; activeParams++; }
    if (guests.length > 0) { totalPercentage += (guests.filter(g => g.status === 'Sudah Dikirim').length / guests.length) * 100; activeParams++; }
    if (seserahan.length > 0) { totalPercentage += (seserahan.filter(s => s.status === 'Sudah').length / seserahan.length) * 100; activeParams++; }
    if (mahar.length > 0) { totalPercentage += (mahar.filter(m => m.status === 'Sudah').length / mahar.length) * 100; activeParams++; }
    
    // Kalkulasi kesiapan dana menggunakan definisi Dana Terkumpul yang baru
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
      savings, setSavings, danaTerkumpul, // <-- Dana Terkumpul yang diekspor sudah pakai rumus baru
      overallProgress: calculateProgress()
    }}>
      {children}
    </WeddingContext.Provider>
  );
};