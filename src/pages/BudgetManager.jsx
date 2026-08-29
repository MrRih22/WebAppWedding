import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';

const CATEGORIES = ["Mahar", "Seserahan", "Undangan", "Souvenir", "Katering", "Paket Wedding Lengkap", "Transportasi", "Mc + Entertaint", "Pengeluaran Lainnya"];
const COLORS = ['#879A83', '#D4AF37', '#2C362A', '#E5C158', '#A3B19F', '#B5952F', '#F4A261', '#E76F51', '#264653'];

export default function BudgetManager() {
  const { budgets, setBudgets } = useContext(WeddingContext);
  const [newItem, setNewItem] = useState({ kategori: CATEGORIES[0], deskripsi: '', rencana: '', aktual: '', dibayar: '', jatuhTempo: '', isLunas: false });

  const handleAdd = (e) => {
    e.preventDefault();
    setBudgets([...budgets, { ...newItem, id: Date.now() }]);
    setNewItem({ kategori: CATEGORIES[0], deskripsi: '', rencana: '', aktual: '', dibayar: '', jatuhTempo: '', isLunas: false });
  };

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  const chartData = CATEGORIES.map(cat => ({
    name: cat, value: budgets.filter(b => b.kategori === cat).reduce((acc, curr) => acc + Number(curr.aktual || 0), 0)
  })).filter(data => data.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 lg:w-1/3">
          <h3 className="text-lg font-bold text-sage-900 mb-4">Tambah Pengeluaran</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <select className="w-full p-2 border rounded-lg text-sm" value={newItem.kategori} onChange={e => setNewItem({...newItem, kategori: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Deskripsi" required className="w-full p-2 border rounded-lg text-sm" value={newItem.deskripsi} onChange={e => setNewItem({...newItem, deskripsi: e.target.value})} />
            <input type="number" placeholder="Budget Rencana" required className="w-full p-2 border rounded-lg text-sm" value={newItem.rencana} onChange={e => setNewItem({...newItem, rencana: e.target.value})} />
            <input type="number" placeholder="Budget Aktual" className="w-full p-2 border rounded-lg text-sm" value={newItem.aktual} onChange={e => setNewItem({...newItem, aktual: e.target.value})} />
            <input type="number" placeholder="Telah Dibayar" className="w-full p-2 border rounded-lg text-sm" value={newItem.dibayar} onChange={e => setNewItem({...newItem, dibayar: e.target.value})} />
            <input type="date" required className="w-full p-2 border rounded-lg text-sm" value={newItem.jatuhTempo} onChange={e => setNewItem({...newItem, jatuhTempo: e.target.value})} />
            <button type="submit" className="w-full bg-sage-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-sage-900 transition-colors">
              <Plus size={16} /> Tambah Item
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 lg:w-2/3 flex flex-col">
           <h3 className="text-lg font-bold text-sage-900 mb-4">Sebaran Aktual per Kategori</h3>
           <div className="flex-1 min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={chartData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                   {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                 </Pie>
                 <Tooltip formatter={(value) => formatIDR(value)} />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sage-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-sage-50 text-sage-900">
              <tr>
                <th className="p-4 font-semibold">Kategori & Deskripsi</th>
                <th className="p-4 font-semibold">Rencana</th>
                <th className="p-4 font-semibold">Aktual</th>
                <th className="p-4 font-semibold">Dibayar</th>
                <th className="p-4 font-semibold">Sisa</th>
                <th className="p-4 font-semibold text-center">Lunas</th>
                <th className="p-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {budgets.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4"><div className="font-medium text-sage-900">{item.deskripsi}</div><div className="text-xs text-gray-500">{item.kategori}</div></td>
                  <td className="p-4">{formatIDR(item.rencana)}</td>
                  <td className="p-4">{formatIDR(item.aktual)}</td>
                  <td className="p-4 text-sage-500">{formatIDR(item.dibayar)}</td>
                  <td className="p-4 text-red-400">{formatIDR(Number(item.aktual || 0) - Number(item.dibayar || 0))}</td>
                  <td className="p-4 text-center">
                    <input type="checkbox" checked={item.isLunas} onChange={() => setBudgets(budgets.map(b => b.id === item.id ? { ...b, isLunas: !b.isLunas } : b))} className="w-4 h-4 accent-gold-500" />
                  </td>
                  <td className="p-4"><button onClick={() => setBudgets(budgets.filter(b => b.id !== item.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}