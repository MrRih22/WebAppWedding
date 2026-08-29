import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function GuestList() {
  const { guests = [], setGuests } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ nama: '', pihak: 'Azzam', hubungan: 'Keluarga', alamat: '', status: 'Belum Dikirim' });
  const [editId, setEditId] = useState(null);

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
            {guests?.map(g => (
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
                    <button onClick={() => handleEdit(g)} className="text-gray-400 hover:text-blue-500"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(g.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!guests || guests.length === 0) && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400">Belum ada daftar tamu undangan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
