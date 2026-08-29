import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  // Sesi Login 24 Jam di Local Storage
  const checkSession = () => {
    localStorage.removeItem('wedding_user'); 
    const sessionData = JSON.parse(localStorage.getItem('wedding_session'));
    if (sessionData && new Date().getTime() < sessionData.expiry) return sessionData.username;
    localStorage.removeItem('wedding_session');
    return null;
  };

  const [user, setUser] = useState(checkSession());
  
  // State Data Aplikasi
  const [budgets, setBudgets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [guests, setGuests] = useState([]);
  const [seserahan, setSeserahan] = useState([]);
  const [mahar, setMahar] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [rencanaDana, setRencanaDana] = useState(0);
  const [savings, setSavings] = useState([]);

  // Tarik Data & Pasang Real-Time Listener saat User Login
  useEffect(() => {
    if (user) {
      fetchAllData();

      const channel = supabase.channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          fetchAllData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      const [
        { data: budgetData },
        { data: taskData },
        { data: guestData },
        { data: seserahanData },
        { data: maharData },
        { data: contactData },
        { data: savingData },
        { data: configData }
      ] = await Promise.all([
        supabase.from('budgets').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('guests').select('*'),
        supabase.from('seserahan').select('*'),
        supabase.from('mahar').select('*'),
        supabase.from('contacts').select('*'),
        supabase.from('savings').select('*'),
        supabase.from('config').select('*').eq('id', 1).single()
      ]);

      if (budgetData) setBudgets(budgetData);
      if (taskData) setTasks(taskData);
      if (guestData) setGuests(guestData);
      if (seserahanData) setSeserahan(seserahanData);
      if (maharData) setMahar(maharData);
      if (contactData) setContacts(contactData);
      if (savingData) setSavings(savingData);
      if (configData) setRencanaDana(configData.rencanaDana);
    } catch (error) {
      console.error("Gagal sinkronisasi data dari Supabase:", error);
    }
  };

  const updateRencanaDana = async (newVal) => {
    setRencanaDana(newVal);
    await supabase.from('config').update({ rencanaDana: Number(newVal) }).eq('id', 1);
  };

  const login = (username, password) => {
    if ((username === 'Azzam' || username === 'Irma') && password === '060626') {
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); 
      localStorage.setItem('wedding_session', JSON.stringify({ username, expiry: expiryTime }));
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('wedding_session');
    setUser(null);
  };

  const totalTabungan = savings?.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0) || 0;
  const totalDibayar = budgets?.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0) || 0;
  const danaTerkumpul = totalTabungan + totalDibayar;

  const calculateProgress = () => {
    let totalPercentage = 0; let activeParams = 0;
    if (tasks.length > 0) { totalPercentage += (tasks.filter(t => t.status === 'Selesai').length / tasks.length) * 100; activeParams++; }
    if (budgets.length > 0) { totalPercentage += (budgets.filter(b => b.isLunas).length / budgets.length) * 100; activeParams++; }
    if (guests.length > 0) { totalPercentage += (guests.filter(g => g.status === 'Sudah Dikirim').length / guests.length) * 100; activeParams++; }
    if (seserahan.length > 0) { totalPercentage += (seserahan.filter(s => s.status === 'Sudah').length / seserahan.length) * 100; activeParams++; }
    if (mahar.length > 0) { totalPercentage += (mahar.filter(m => m.status === 'Sudah').length / mahar.length) * 100; activeParams++; }
    if (Number(rencanaDana) > 0) { totalPercentage += (Math.min(danaTerkumpul / Number(rencanaDana), 1)) * 100; activeParams++; }
    return activeParams === 0 ? 0 : Math.round(totalPercentage / activeParams);
  };

  return (
    <WeddingContext.Provider value={{
      user, login, logout, 
      budgets, setBudgets, 
      tasks, setTasks,
      guests, setGuests, 
      seserahan, setSeserahan, 
      mahar, setMahar, 
      contacts, setContacts,
      rencanaDana, setRencanaDana: updateRencanaDana, 
      savings, setSavings, 
      danaTerkumpul, 
      overallProgress: calculateProgress()
    }}>
      {children}
    </WeddingContext.Provider>
  );
};