import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, Phone, Edit, Search, Filter } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function ContactInfo() {
  const { contacts = [], setContacts } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ nama: '', role: '', noHp: '', notes: '' });
  const [editId, setEditId] = useState(null);

  // State untuk Search dan Filter Role
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const updated = { ...newItem, id: editId };
      const { error } = await supabase.from('contacts').update(updated).eq('id', editId);
      if (!error) {
        setContacts(contacts.map(c => c.id === editId ? updated : c));
        setEditId(null);
      } else {
        alert("Gagal update kontak: " + error.message);
      }
    } else {
      const dataToInsert = { ...newItem, id: Date.now() };
      const { error } = await supabase.from('contacts').insert([dataToInsert]);
      if (!error) {
        setContacts([...contacts, dataToInsert]);
      } else {
        alert("Gagal menambah kontak: " + error.message);
      }
    }
    setNewItem({ nama: '', role: '', noHp: '', notes: '' });
  };

  const handleEdit = (item) => { setEditId(item.id); setNewItem({ ...item }); };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (!error) setContacts(contacts.filter(c => c.id !== id));
  };

  // Ambil daftar role unik secara otomatis untuk pilihan filter
  const uniqueRoles = ['Semua', ...new Set(contacts.map(c => c.role).filter(Boolean))];

  // Logika Pencarian & Filter Kontak
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.noHp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === 'Semua' || c.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">{editId ? 'Edit Kontak Vendor/Keluarga' : 'Tambah Kontak Vendor/Keluarga'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Nama" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.nama} onChange={e => setNewItem({...newItem, nama: e.target.value})} />
          <input type="text" placeholder="Role (Cth: WO / MUA / Keluarga)" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.role} onChange={e => setNewItem({...newItem, role: e.target.value})} />
          <input type="text" placeholder="Nomor WhatsApp" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.noHp} onChange={e => setNewItem({...newItem, noHp: e.target.value})} />
          <input type="text" placeholder="Catatan" className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.notes} onChange={e => setNewItem({...newItem, notes: e.target.value})} />
          
          <div className="flex gap-2 md:col-span-4">
            <button type="submit" className="flex-1 bg-sage-500 text-white p-3 rounded-lg font-medium hover:bg-sage-900 transition-colors">{editId ? 'Simpan' : '+ Tambah Kontak'}</button>
            {editId && <button type="button" onClick={() => {setEditId(null); setNewItem({ nama: '', role: '', noHp: '', notes: '' })}} className="bg-gray-100 px-6 rounded-lg font-medium">Batal</button>}
          </div>
        </form>
      </div>

      {/* Bagian Search & Filter Role Kontak */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-sage-50 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Kolom Search Manual */}
        <div className="relative w-full md:w-1/3">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama, role, nomor HP..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-500 bg-gray-50 font-medium" 
          />
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-sage-700" />
          <span className="text-sm font-bold text-sage-900">Role:</span>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)} 
            className="p-2 border rounded-lg text-xs font-semibold outline-none bg-gray-50 cursor-pointer flex-1 md:flex-initial"
          >
            {uniqueRoles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts?.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-sage-50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sage-900 text-lg">{c.nama}</h4>
                <span className="bg-sage-50 text-sage-700 text-xs px-2.5 py-1 rounded-md font-semibold">{c.role}</span>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-2"><Phone size={14} className="text-sage-500"/> {c.noHp}</p>
              {c.notes && <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">{c.notes}</p>}
            </div>
            <div className="flex justify-end items-center gap-3 mt-4 pt-3 border-t border-gray-100">
              <a href={`https://wa.me/${c.noHp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-xs bg-sage-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-sage-900 transition-colors">Chat WA</a>
              <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
              <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
        {(!filteredContacts || filteredContacts.length === 0) && (
          <div className="col-span-full bg-white p-8 rounded-2xl text-center text-gray-400 border border-sage-50">Tidak ada kontak yang sesuai dengan pencarian.</div>
        )}
      </div>
    </div>
  );
}
