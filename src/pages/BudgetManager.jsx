import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../supabaseClient';

const CATEGORIES = ["Mahar ( Uang + Emas )", "Biaya Gedung", "Undangan", "Souvenir", "Katering", "Penginapan", "Paket Wedding Lengkap", "Transportasi", "Mc + Entertaint", "Pengeluaran Lainnya"];
const COLORS = ['#879A83', '#D4AF37', '#2C362A', '#E5C158', '#A3B19F', '#B5952F', '#F4A261', '#E76F51', '#264653', '#1D3557'];

export default function BudgetManager() {
  const { budgets = [], setBudgets } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ kategori: CATEGORIES[0], deskripsi: '', rencana: '', aktual: '', dibayar: '', jatuhTempo: '', isLunas: false });
  const [editId, setEditId] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const updatedData = { ...newItem, id: editId };
      const { error } = await supabase.from('budgets').update(updatedData).eq('id', editId);
      if (!error) {
        setBudgets(budgets.map(b => b.id === editId ? updatedData : b));
        setEditId(null);
      }
    } else {
      const dataToInsert = { ...newItem, id: Date.now() };
      const { error } = await supabase.from('budgets').insert([dataToInsert]);
      if (!error) {
        setBudgets([...budgets, dataToInsert]);
      }
    }
    setNewItem({ kategori: CATEGORIES[0], deskripsi: '', rencana: '', aktual: '', dibayar: '', jatuhTempo: '', isLunas: false });
  };

  const handleEdit = (item) => { 
    setEditId(item.id); 
    setNewItem({...item}); 
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    if (!error) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const handleToggleLunas = async (item) => {
    const newStatus = !item.isLunas;
    const { error } = await supabase.from('budgets').update({ isLunas: newStatus }).eq('id', item.id);
    if (!error) {
      setBudgets(budgets.map(b => b.id === item.id ? { ...b, isLunas: newStatus } : b));
    }
  };

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num || 0);

  const chartData = CATEGORIES.map(cat => ({ 
    name: cat, 
    value: budgets.filter(b => b.kategori === cat).reduce((acc, curr) => acc + Number(curr.aktual || 0), 0) 
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 lg:w-1/3">
          <h3 className="text-lg font-bold text-sage-900 mb-4">{editId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <select className="w-full p-2 border rounded-lg text-sm" value={newItem.kategori} onChange={e => setNewItem({...newItem, kategori: e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Deskripsi" required className="w-full p-2 border rounded-lg text-sm" value={newItem.deskripsi} onChange={e => setNewItem({...newItem, deskripsi: e.target.value})} />
            <input type="number" placeholder="Budget Rencana" required className="w-full p-2 border rounded-lg text-sm" value={newItem.rencana} onChange={e => setNewItem({...newItem, rencana: e.target.value})} />
            <input type="number" placeholder="Budget Aktual" className="w-full p-2 border rounded-lg text-sm" value={newItem.aktual} onChange={e => setNewItem({...newItem, aktual: e.target.value})} />
            <input type="number" placeholder="Telah Dibayar" className="w-full p-2 border rounded-lg text-sm" value={newItem.dibayar} onChange={e => setNewItem({...newItem, dibayar: e.target.value})} />
            <input type="date" required className="w-full p-2 border rounded-lg text-sm" value={newItem.jatuhTempo} onChange={e => setNewItem({...newItem, jatuhTempo: e.target.value})} />
            
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-sage-500 text-white p-2.5 rounded-lg font-medium">{editId ? 'Simpan' : '+ Tambah'}</button>
              {editId && <button type="button" onClick={() => {setEditId(null); setNewItem({ kategori: CATEGORIES[0], deskripsi: '', rencana: '', aktual: '', dibayar: '', jatuhTempo: '', isLunas: false })}} className="bg-gray-100 p-2.5 rounded-lg">Batal</button>}
            </div>
          </form>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 lg:w-2/3 h-[400px]">
           <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">{chartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={formatIDR}/><Legend /></PieChart></ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-sage-50">
        <table className="w-full text-sm text-left whitespace-nowrap"><thead className="bg-sage-50 text-sage-900"><tr><th className="p-4">Kategori & Deskripsi</th><th className="p-4">Rencana</th><th className="p-4">Aktual</th><th className="p-4">Dibayar</th><th className="p-4">Sisa</th><th className="p-4 text-center">Lunas</th><th className="p-4 text-center">Aksi</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {budgets?.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4"><div className="font-medium text-sage-900">{item.deskripsi}</div><div className="text-xs text-gray-500">{item.kategori}</div></td>
                <td className="p-4">{formatIDR(item.rencana)}</td>
                <td className="p-4">{formatIDR(item.aktual)}</td>
                <td className="p-4 text-sage-500 font-medium">{formatIDR(item.dibayar)}</td>
                <td className="p-4 text-red-400 font-medium">{formatIDR(Number(item.aktual||0) - Number(item.dibayar||0))}</td>
                <td className="p-4 text-center"><input type="checkbox" checked={item.isLunas} onChange={() => handleToggleLunas(item)} className="w-4 h-4 accent-gold-500 cursor-pointer" /></td>
                <td className="p-4"><div className="flex justify-center gap-3"><button onClick={() => handleEdit(item)} className="text-gray-400 hover:text-blue-500"><Edit size={18} /></button><button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}