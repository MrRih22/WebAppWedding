import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
<<<<<<< HEAD
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
=======
  
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
>>>>>>> ff5fe2458f19fb1577ce7aedae8bc9d7485e67e9

  // --- 3. FUNGSI LOGIN & LOGOUT ---
  const login = (username, password) => {
    if ((username === 'Azzam' || username === 'Irma') && password === '060626') {
<<<<<<< HEAD
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); 
      localStorage.setItem('wedding_session', JSON.stringify({ username, expiry: expiryTime }));
=======
      
      // Atur batas waktu sesi: 24 Jam dari sekarang
      // Rumus: 24 jam * 60 menit * 60 detik * 1000 milidetik
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); 
      
      // Simpan username sekaligus waktu kedaluwarsanya
      localStorage.setItem('wedding_session', JSON.stringify({
        username: username,
        expiry: expiryTime
      }));
      
>>>>>>> ff5fe2458f19fb1577ce7aedae8bc9d7485e67e9
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('wedding_session');
    setUser(null);
  };

<<<<<<< HEAD
  const totalTabungan = savings?.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0) || 0;
  const totalDibayar = budgets?.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0) || 0;
=======
  // --- 4. KALKULATOR DASHBOARD (TIDAK BERUBAH) ---
  const totalTabungan = savings.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);
  const totalDibayar = budgets.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0);
>>>>>>> ff5fe2458f19fb1577ce7aedae8bc9d7485e67e9
  const danaTerkumpul = totalTabungan + totalDibayar;

  const calculateProgress = () => {
    let totalPercentage = 0; let activeParams = 0;
    if (tasks.length > 0) { totalPercentage += (tasks.filter(t => t.status === 'Selesai').length / tasks.length) * 100; activeParams++; }
    if (budgets.length > 0) { totalPercentage += (budgets.filter(b => b.isLunas).length / budgets.length) * 100; activeParams++; }
    if (guests.length > 0) { totalPercentage += (guests.filter(g => g.status === 'Sudah Dikirim').length / guests.length) * 100; activeParams++; }
    if (seserahan.length > 0) { totalPercentage += (seserahan.filter(s => s.status === 'Sudah').length / seserahan.length) * 100; activeParams++; }
    if (mahar.length > 0) { totalPercentage += (mahar.filter(m => m.status === 'Sudah').length / mahar.length) * 100; activeParams++; }
<<<<<<< HEAD
    if (Number(rencanaDana) > 0) { totalPercentage += (Math.min(danaTerkumpul / Number(rencanaDana), 1)) * 100; activeParams++; }
=======
    
    if (Number(rencanaDana) > 0) { 
      totalPercentage += (Math.min(danaTerkumpul / Number(rencanaDana), 1)) * 100; 
      activeParams++; 
    }
    
>>>>>>> ff5fe2458f19fb1577ce7aedae8bc9d7485e67e9
    return activeParams === 0 ? 0 : Math.round(totalPercentage / activeParams);
  };

  return (
    <WeddingContext.Provider value={{
<<<<<<< HEAD
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
=======
      user, login, logout,
      budgets, setBudgets, tasks, setTasks,
      guests, setGuests, seserahan, setSeserahan,
      mahar, setMahar, contacts, setContacts,
      rencanaDana, setRencanaDana, 
      savings, setSavings, danaTerkumpul,
>>>>>>> ff5fe2458f19fb1577ce7aedae8bc9d7485e67e9
      overallProgress: calculateProgress()
    }}>
      {children}
    </WeddingContext.Provider>
  );
};
