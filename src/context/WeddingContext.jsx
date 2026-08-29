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
  
  useEffect(() => { localStorage.setItem('wedding_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('wedding_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('wedding_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('wedding_guests', JSON.stringify(guests)); }, [guests]);
  useEffect(() => { localStorage.setItem('wedding_seserahan', JSON.stringify(seserahan)); }, [seserahan]);
  useEffect(() => { localStorage.setItem('wedding_mahar', JSON.stringify(mahar)); }, [mahar]);
  useEffect(() => { localStorage.setItem('wedding_contacts', JSON.stringify(contacts)); }, [contacts]);

  const login = (username, password) => {
    if ((username === 'Azzam' || username === 'Irma') && password === '060626') {
      setUser(username); return true;
    }
    return false;
  };
  const logout = () => setUser(null);

  const calculateProgress = () => {
    let score = 0; let maxScore = 0;
    const weight = 20; 
    
    if (tasks.length) { maxScore += weight; score += (tasks.filter(t => t.status === 'Selesai').length / tasks.length) * weight; }
    if (budgets.length) { maxScore += weight; score += (budgets.filter(b => b.isLunas).length / budgets.length) * weight; }
    if (guests.length) { maxScore += weight; score += (guests.filter(g => g.status === 'Sudah Dikirim').length / guests.length) * weight; }
    if (seserahan.length) { maxScore += weight; score += (seserahan.filter(s => s.status === 'Sudah').length / seserahan.length) * weight; }
    if (mahar.length) { maxScore += weight; score += (mahar.filter(m => m.status === 'Sudah').length / mahar.length) * weight; }
    
    return maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  };

  return (
    <WeddingContext.Provider value={{
      user, login, logout,
      budgets, setBudgets, tasks, setTasks,
      guests, setGuests, seserahan, setSeserahan,
      mahar, setMahar, contacts, setContacts,
      overallProgress: calculateProgress()
    }}>
      {children}
    </WeddingContext.Provider>
  );
};