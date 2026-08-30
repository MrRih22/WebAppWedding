import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, ExternalLink, Edit, ArrowUpDown, Filter, Search } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../supabaseClient';

export default function Seserahan() {
  const { seserahan = [], setSeserahan } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ item: '', status: 'Belum', harga: '', link: '', keterangan: '', qty: 1 });
  const [editId, setEditId] = useState(null); 

  // State untuk Search, Filter, & Urutkan
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(num) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const updated = { ...newItem, id: editId };
      const { error } = await supabase.from('seserahan').update(updated).eq('id', editId);
      if (!error) {
        setSeserahan(seserahan.map(s => s.id === editId ? updated : s));
        setEditId(null);
      } else {
        alert("Gagal update seserahan: " + error.message);
      }
    } else {
      const dataToInsert = { ...newItem, id: Date.now() };
      const { error } = await supabase.from('seserahan').insert([dataToInsert]);
      if (!error) {
        setSeserahan([...seserahan, dataToInsert]);
      } else {
        alert("Gagal menambah seserahan: " + error.message);
      }
    }
    setNewItem({ item: '', status: 'Belum', harga: '', link: '', keterangan: '', qty: 1 });
  };

  const handleEdit = (item) => { setEditId(item.id); setNewItem({ ...item }); };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('seserahan').delete().eq('id', id);
    if (!error) setSeserahan(seserahan.filter(s => s.id !== id));
  };

  const handleStatusChange = async (item, newStatus) => {
    const { error } = await supabase.from('seserahan').update({ status: newStatus }).eq('id', item.id);
    if (!error) setSeserahan(seserahan.map(s => s.id === item.id ? { ...s, status: newStatus } : s));
  };

  // Logika Pencarian, Filter & Urutkan data seserahan
  const filteredSeserahan = seserahan.filter(s => {
    const matchesSearch = 
      s.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.keterangan && s.keterangan.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.link && s.link.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'Semua' || s.status === filterStatus;

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'namaAsc') return a.item.localeCompare(b.item);
    if (sortBy === 'namaDesc') return b.item.localeCompare(a.item);
    if (sortBy === 'hargaAsc') return (a.harga * a.qty) - (b.harga * b.qty);
    if (sortBy === 'hargaDesc') return (b.harga * b.qty) - (a.harga * a.qty);
    return 0; // Default
  });

  // Hitung jumlah item saja
  const totalItemCount = filteredSeserahan.length;

  const totalSudah = seserahan.filter(s => s.status === 'Sudah').reduce((acc, s) => acc + (Number(s.harga) * Number(s.qty)), 0);
  const totalBelum = seserahan.filter(s => s.status === 'Belum').reduce((acc, s) => acc + (Number(s.harga) * Number(s.qty)), 0);
  const chartData = [];
  if (totalSudah > 0) chartData.push({ name: 'Sudah Dibeli', value: totalSudah, color: '#879A83' });
  if (totalBelum > 0) chartData.push({ name: 'Belum Dibeli', value: totalBelum, color: '#E76F51' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 lg:w-2/3">
          <h3 className="text-lg font-bold text-sage-900 mb-4">{editId ? 'Edit Seserahan' : 'Tambah Seserahan'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Nama Item" required className="p-3 border rounded-lg text-sm md:col-span-2 outline-none focus:ring-2 focus:ring-sage-500" value={newItem.item} onChange={e => setNewItem({...newItem, item: e.target.value})} />
            <input type="number" placeholder="Harga Satuan" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.harga} onChange={e => setNewItem({...newItem, harga: e.target.value})} />
            <input type="number" placeholder="Qty" required min="1" className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: e.target.value})} />
            <input type="url" placeholder="Link Barang (Opsional)" className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} />
            <input type="text" placeholder="Keterangan" className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.keterangan} onChange={e => setNewItem({...newItem, keterangan: e.target.value})} />
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" className="flex-1 bg-sage-500 text-white p-3 rounded-lg font-medium hover:bg-sage-900 transition-colors">{editId ? 'Simpan' : '+ Tambah'}</button>
              {editId && <button type="button" onClick={() => {setEditId(null); setNewItem({ item: '', status: 'Belum', harga: '', link: '', keterangan: '', qty: 1 })}} className="bg-gray-100 p-3 rounded-lg font-medium">Batal</button>}
            </div>
          </form>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 lg:w-1/3 h-[300px]">
           {chartData.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} innerRadius={60} outerRadius={90} dataKey="value">{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip formatter={formatIDR}/><Legend /></PieChart></ResponsiveContainer>) : (<div className="h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data.</div>)}
        </div>
      </div>

      {/* Bagian Search, Filter, Urutkan & Informasi Jumlah Item */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-sage-50 flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Kolom Search Manual */}
        <div className="relative w-full lg:w-1/3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari item, keterangan..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-500 bg-gray-50 font-medium" 
            />
          </div>
          {/* Label Informasi Jumlah Item (Hanya Jumlah Item) */}
          <div className="bg-sage-50 text-sage-900 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border border-sage-100">
            {totalItemCount} Item
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Filter Status */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-sage-700" />
            <span className="text-sm font-bold text-sage-900">Status:</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-lg text-xs font-semibold outline-none bg-gray-50 cursor-pointer flex-1 sm:flex-initial">
              <option value="Semua">Semua Status</option>
              <option value="Belum">Belum</option>
              <option value="Sudah">Sudah</option>
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
              <option value="hargaAsc">Total Harga (Termurah)</option>
              <option value="hargaDesc">Total Harga (Termahal)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-sage-50">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-sage-50 text-sage-900">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Total</th>
              <th className="p-4">Link</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSeserahan?.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-sage-900">
                  {s.item}
                  {s.keterangan && <div className="text-xs text-gray-500 font-normal">{s.keterangan}</div>}
                </td>
                <td className="p-4">{formatIDR(s.harga)}</td>
                <td className="p-4 font-bold">{s.qty}</td>
                <td className="p-4 font-bold text-gold-600">{formatIDR(s.harga * s.qty)}</td>
                <td className="p-4">{s.link && <a href={s.link} target="_blank" rel="noreferrer" className="text-blue-500 flex items-center gap-1 hover:underline"><ExternalLink size={14}/> Beli</a>}</td>
                <td className="p-4">
                  <select value={s.status} onChange={(e) => handleStatusChange(s, e.target.value)} className={`p-2 rounded-lg text-xs font-semibold outline-none cursor-pointer ${s.status === 'Sudah' ? 'bg-sage-100 text-sage-900' : 'bg-red-50 text-red-600'}`}>
                    <option value="Belum">Belum</option>
                    <option value="Sudah">Sudah</option>
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleEdit(s)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!filteredSeserahan || filteredSeserahan.length === 0) && (
              <tr><td colSpan="7" className="p-8 text-center text-gray-400">Tidak ada data seserahan yang sesuai dengan pencarian.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
