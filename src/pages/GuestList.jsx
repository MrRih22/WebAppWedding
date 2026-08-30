import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, Edit, ArrowUpDown, Filter, Search, ExternalLink, Copy, Check } from 'lucide-react';
import { supabase } from '../supabaseClient';

const BASE_URL = "https://wedding-invitation-13.netlify.app/?to=";

export default function GuestList() {
  const { guests = [], setGuests } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ nama: '', pihak: 'Azzam', hubungan: 'Keluarga', alamat: '', status: 'Belum Dikirim', customLink: '' });
  const [editId, setEditId] = useState(null);

  // State untuk Search, Filter, & Urutkan
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');

  // State untuk indikator 'Copied' pada baris tertentu
  const [copiedId, setCopiedId] = useState(null);

  // Otomatis isi customLink saat nama diketik
  const handleNamaChange = (e) => {
    const namaTamu = e.target.value;
    setNewItem(prev => ({
      ...prev,
      nama: namaTamu,
      customLink: namaTamu.trim() ? `${BASE_URL}${encodeURIComponent(namaTamu.trim())}` : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editId) {
      const payload = {
        nama: newItem.nama,
        pihak: newItem.pihak,
        hubungan: newItem.hubungan,
        alamat: newItem.alamat,
        status: newItem.status
      };
      const { error } = await supabase.from('guests').update(payload).eq('id', editId);
      if (!error) {
        setGuests(guests.map(g => g.id === editId ? { ...newItem, id: editId } : g));
        setEditId(null);
      } else {
        alert("Gagal update tamu: " + error.message);
      }
    } else {
      const newId = Date.now();
      const payload = {
        id: newId,
        nama: newItem.nama,
        pihak: newItem.pihak,
        hubungan: newItem.hubungan,
        alamat: newItem.alamat,
        status: newItem.status
      };
      
      const { error } = await supabase.from('guests').insert([payload]);
      if (!error) {
        setGuests([...guests, { ...newItem, id: newId }]);
      } else {
        alert("Gagal menambah tamu: " + error.message);
      }
    }
    setNewItem({ nama: '', pihak: 'Azzam', hubungan: 'Keluarga', alamat: '', status: 'Belum Dikirim', customLink: '' });
  };

  const handleEdit = (item) => { 
    setEditId(item.id); 
    setNewItem({ 
      ...item, 
      customLink: item.customLink || (item.nama ? `${BASE_URL}${encodeURIComponent(item.nama)}` : '') 
    }); 
  };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) setGuests(guests.filter(g => g.id !== id));
  };

  const handleStatusChange = async (item, newStatus) => {
    const { error } = await supabase.from('guests').update({ status: newStatus }).eq('id', item.id);
    if (!error) setGuests(guests.map(g => g.id === item.id ? { ...g, status: newStatus } : g));
  };

  // Fungsi Salin Link Undangan
  const handleCopyLink = (g) => {
    const finalLink = g.customLink || `${BASE_URL}${encodeURIComponent(g.nama || '')}`;
    navigator.clipboard.writeText(finalLink);
    setCopiedId(g.id);
    setTimeout(() => setCopiedId(null), 2000); // Reset ikon setelah 2 detik
  };

  // Logika Pencarian, Filter, & Urutkan data tamu
  const filteredGuests = guests.filter(g => {
    const activeLink = g.customLink || `${BASE_URL}${encodeURIComponent(g.nama || '')}`;
    const matchesSearch = 
      g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.hubungan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.pihak.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activeLink.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'Semua' || g.status === filterStatus;

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'namaAsc') return a.nama.localeCompare(b.nama);
    if (sortBy === 'namaDesc') return b.nama.localeCompare(a.nama);
    if (sortBy === 'pihakAsc') return a.pihak.localeCompare(b.pihak);
    return 0; 
  });

  // Hitung jumlah tamu dari hasil filter
  const totalGuestCount = filteredGuests.length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">{editId ? 'Edit Tamu' : 'Tambah Tamu Undangan'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input 
            type="text" 
            placeholder="Nama Tamu" 
            required 
            className="p-3 border rounded-lg text-sm lg:col-span-2 outline-none focus:ring-2 focus:ring-sage-500" 
            value={newItem.nama} 
            onChange={handleNamaChange} 
          />
          <select className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.pihak} onChange={e => setNewItem({...newItem, pihak: e.target.value})}><option>Azzam</option><option>Irma</option><option>Bersama</option></select>
          <input type="text" placeholder="Hubungan (Cth: Teman Kerja)" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.hubungan} onChange={e => setNewItem({...newItem, hubungan: e.target.value})} />
          <input type="text" placeholder="Alamat / Kota" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.alamat} onChange={e => setNewItem({...newItem, alamat: e.target.value})} />
          
          <div className="lg:col-span-5 flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Link Undangan Digital (Otomatis dari nama tamu, bisa diedit manual jika perlu):</label>
            <input 
              type="url" 
              placeholder="https://wedding-invitation-13.netlify.app/?to=NamaTamu" 
              className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500 bg-gray-50 font-mono text-xs" 
              value={newItem.customLink} 
              onChange={e => setNewItem({...newItem, customLink: e.target.value})} 
            />
          </div>
          
          <div className="flex gap-2 lg:col-span-5">
            <button type="submit" className="flex-1 bg-sage-500 text-white p-3 rounded-lg font-medium hover:bg-sage-900 transition-colors">{editId ? 'Simpan Perubahan' : '+ Tambah Tamu'}</button>
            {editId && <button type="button" onClick={() => {setEditId(null); setNewItem({ nama: '', pihak: 'Azzam', hubungan: 'Keluarga', alamat: '', status: 'Belum Dikirim', customLink: '' })}} className="bg-gray-100 px-6 rounded-lg font-medium">Batal</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-sage-50 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="relative w-full lg:w-1/3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama, alamat, hubungan, link..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-500 bg-gray-50 font-medium" 
            />
          </div>
          {/* Label Informasi Jumlah Tamu */}
          <div className="bg-sage-50 text-sage-900 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border border-sage-100">
            {totalGuestCount} Tamu
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-sage-700" />
            <span className="text-sm font-bold text-sage-900">Status:</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-lg text-xs font-semibold outline-none bg-gray-50 cursor-pointer flex-1 sm:flex-initial">
              <option value="Semua">Semua Status</option>
              <option value="Belum Dikirim">Belum Dikirim</option>
              <option value="Sudah Dikirim">Sudah Dikirim</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown size={18} className="text-sage-700" />
            <span className="text-sm font-bold text-sage-900">Urutkan:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded-lg text-xs font-semibold outline-none bg-gray-50 cursor-pointer flex-1 sm:flex-initial">
              <option value="default">Default</option>
              <option value="namaAsc">Nama (A - Z)</option>
              <option value="namaDesc">Nama (Z - A)</option>
              <option value="pihakAsc">Pihak Pengundang</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-sage-50">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-sage-50 text-sage-900">
            <tr>
              <th className="p-4">Nama</th>
              <th className="p-4">Pihak</th>
              <th className="p-4">Hubungan</th>
              <th className="p-4">Alamat</th>
              <th className="p-4">Link Undangan</th>
              <th className="p-4">Status Undangan</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredGuests?.map(g => {
              const finalLink = g.customLink || `${BASE_URL}${encodeURIComponent(g.nama || '')}`;
              return (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-sage-900">{g.nama}</td>
                  <td className="p-4 font-semibold text-xs text-sage-600">{g.pihak}</td>
                  <td className="p-4">{g.hubungan}</td>
                  <td className="p-4 text-gray-500">{g.alamat}</td>
                  <td className="p-4">
                    <a href={finalLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs font-medium">
                      <ExternalLink size={14} /> Buka Link
                    </a>
                  </td>
                  <td className="p-4">
                    <select 
                      value={g.status} 
                      onChange={(e) => handleStatusChange(g, e.target.value)} 
                      className={`p-2 rounded-lg text-xs font-semibold outline-none cursor-pointer ${g.status === 'Sudah Dikirim' ? 'bg-sage-100 text-sage-900' : 'bg-amber-50 text-amber-600'}`}
                    >
                      <option value="Belum Dikirim">Belum Dikirim</option>
                      <option value="Sudah Dikirim">Sudah Dikirim</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      {/* Tombol Salin Link */}
                      <button 
                        onClick={() => handleCopyLink(g)} 
                        title="Salin Link Undangan"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                      >
                        {copiedId === g.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        {copiedId === g.id ? 'Disalin' : 'Salin'}
                      </button>

                      <button onClick={() => handleEdit(g)} title="Edit" className="text-gray-400 hover:text-blue-500 transition-colors p-1"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(g.id)} title="Hapus" className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!filteredGuests || filteredGuests.length === 0) && (
              <tr><td colSpan="7" className="p-8 text-center text-gray-400">Tidak ada daftar tamu yang sesuai dengan pencarian.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
