import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, Edit, ArrowUpDown, Filter, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function GuestList() {
  const { guests = [], setGuests } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ nama: '', pihak: 'Azzam', hubungan: 'Keluarga', alamat: '', status: 'Belum Dikirim' });
  const [editId, setEditId] = useState(null);

  // State untuk Search, Filter, & Urutkan
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const updated = { ...newItem, id: editId };
      const { error } = await supabase.from('guests').update(updated).eq('id', editId);
      if (!error) {
        setGuests(guests.map(g => g.id === editId ? updated : g));
        setEditId(null);
      } else {
        alert("Gagal update tamu: " + error.message);
      }
    } else {
      const dataToInsert = { ...newItem, id: Date.now() };
      const { error } = await supabase.from('guests').insert([dataToInsert]);
      if (!error) {
        setGuests([...guests, dataToInsert]);
      } else {
        alert("Gagal menambah tamu: " + error.message);
      }
    }
    setNewItem({ nama: '', pihak: 'Azzam', hubungan: 'Keluarga', alamat: '', status: 'Belum Dikirim' });
  };

  const handleEdit = (item) => { setEditId(item.id); setNewItem({ ...item }); };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) setGuests(guests.filter(g => g.id !== id));
  };

  const handleStatusChange = async (item, newStatus) => {
    const { error } = await supabase.from('guests').update({ status: newStatus }).eq('id', item.id);
    if (!error) setGuests(guests.map(g => g.id === item.id ? { ...g, status: newStatus } : g));
  };

  // Logika Pencarian, Filter, & Urutkan data tamu
  const filteredGuests = guests.filter(g => {
    const matchesSearch = 
      g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.hubungan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.pihak.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'Semua' || g.status === filterStatus;

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'namaAsc') return a.nama.localeCompare(b.nama);
    if (sortBy === 'namaDesc') return b.nama.localeCompare(a.nama);
    if (sortBy === 'pihakAsc') return a.pihak.localeCompare(b.pihak);
    return 0; // Default (Waktu input)
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">{editId ? 'Edit Tamu' : 'Tambah Tamu Undangan'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="text" placeholder="Nama Tamu" required className="p-3 border rounded-lg text-sm md:col-span-2 outline-none focus:ring-2 focus:ring-sage-500" value={newItem.nama} onChange={e => setNewItem({...newItem, nama: e.target.value})} />
          <select className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.pihak} onChange={e => setNewItem({...newItem, pihak: e.target.value})}><option>Azzam</option><option>Irma</option><option>Bersama</option></select>
          <input type="text" placeholder="Hubungan (Contoh: Teman Kerja)" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.hubungan} onChange={e => setNewItem({...newItem, hubungan: e.target.value})} />
          <input type="text" placeholder="Alamat / Kota" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.alamat} onChange={e => setNewItem({...newItem, alamat: e.target.value})} />
          
          <div className="flex gap-2 md:col-span-5">
            <button type="submit" className="flex-1 bg-sage-500 text-white p-3 rounded-lg font-medium hover:bg-sage-900 transition-colors">{editId ? 'Simpan Perubahan' : '+ Tambah Tamu'}</button>
            {editId && <button type="button" onClick={() => {setEditId(null); setNewItem({ nama: '', pihak: 'Azzam', hubungan: 'Keluarga', alamat: '', status: 'Belum Dikirim' })}} className="bg-gray-100 px-6 rounded-lg font-medium">Batal</button>}
          </div>
        </form>
      </div>

      {/* Bagian Search, Filter & Urutkan Tamu */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-sage-50 flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Kolom Search Manual */}
        <div className="relative w-full lg:w-1/3">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama, alamat, hubungan..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-500 bg-gray-50 font-medium" 
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Filter Status */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-sage-700" />
            <span className="text-sm font-bold text-sage-900">Status:</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-lg text-xs font-semibold outline-none bg-gray-50 cursor-pointer flex-1 sm:flex-initial">
              <option value="Semua">Semua Status</option>
              <option value="Belum Dikirim">Belum Dikirim</option>
              <option value="Sudah Dikirim">Sudah Dikirim</option>
            </select>
          </div>

          {/* Urutkan */}
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
              <th className="p-4">Status Undangan</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredGuests?.map(g => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-sage-900">{g.nama}</td>
                <td className="p-4 font-semibold text-xs text-sage-600">{g.pihak}</td>
                <td className="p-4">{g.hubungan}</td>
                <td className="p-4 text-gray-500">{g.alamat}</td>
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
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleEdit(g)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(g.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!filteredGuests || filteredGuests.length === 0) && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400">Tidak ada daftar tamu yang sesuai dengan pencarian.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
