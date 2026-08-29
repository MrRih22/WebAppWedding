import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, ExternalLink, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../supabaseClient';

export default function Seserahan() {
  const { seserahan = [], setSeserahan } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ item: '', status: 'Belum', harga: '', link: '', keterangan: '', qty: 1 });
  const [editId, setEditId] = useState(null); 

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(num) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const updated = { ...newItem, id: editId };
      const { error } = await supabase.from('seserahan').update(updated).eq('id', editId);
      if (!error) {
        setSeserahan(seserahan.map(s => s.id === editId ? updated : s));
        setEditId(null);
      }
    } else {
      const dataToInsert = { ...newItem, id: Date.now() };
      const { error } = await supabase.from('seserahan').insert([dataToInsert]);
      if (!error) {
        setSeserahan([...seserahan, dataToInsert]);
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
            <input type="text" placeholder="Nama Item" required className="p-3 border rounded-lg text-sm md:col-span-2" value={newItem.item} onChange={e => setNewItem({...newItem, item: e.target.value})} />
            <input type="number" placeholder="Harga Satuan" required className="p-3 border rounded-lg text-sm" value={newItem.harga} onChange={e => setNewItem({...newItem, harga: e.target.value})} />
            <input type="number" placeholder="Qty" required min="1" className="p-3 border rounded-lg text-sm" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: e.target.value})} />
            <input type="url" placeholder="Link Barang (Opsional)" className="p-3 border rounded-lg text-sm" value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} />
            <input type="text" placeholder="Keterangan" className="p-3 border rounded-lg text-sm" value={newItem.keterangan} onChange={e => setNewItem({...newItem, keterangan: e.target.value})} />
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" className="flex-1 bg-sage-500 text-white p-3 rounded-lg font-medium">{editId ? 'Simpan' : '+ Tambah'}</button>
              {editId && <button type="button" onClick={() => {setEditId(null); setNewItem({ item: '', status: 'Belum', harga: '', link: '', keterangan: '', qty: 1 })}} className="bg-gray-100 p-3 rounded-lg">Batal</button>}
            </div>
          </form>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 lg:w-1/3 h-[300px]">
           {chartData.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} innerRadius={60} outerRadius={90} dataKey="value">{chartData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip formatter={formatIDR}/><Legend /></PieChart></ResponsiveContainer>) : (<div className="h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data.</div>)}
        </div>
      </div>
      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-sage-50">
        <table className="w-full text-sm text-left whitespace-nowrap"><thead className="bg-sage-50 text-sage-900"><tr><th className="p-4">Item</th><th className="p-4">Harga</th><th className="p-4">Qty</th><th className="p-4">Total</th><th className="p-4">Link</th><th className="p-4">Status</th><th className="p-4 text-center">Aksi</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {seserahan?.map(s => (
              <tr key={s.id}><td className="p-4 font-medium">{s.item}</td><td className="p-4">{formatIDR(s.harga)}</td><td className="p-4 font-bold">{s.qty}</td><td className="p-4 font-bold text-gold-600">{formatIDR(s.harga * s.qty)}</td><td className="p-4">{s.link && <a href={s.link} target="_blank" rel="noreferrer" className="text-blue-500 flex items-center gap-1"><ExternalLink size={14}/> Beli</a>}</td>
                <td className="p-4"><select value={s.status} onChange={(e) => handleStatusChange(s, e.target.value)} className={`p-2 rounded-lg text-xs font-semibold ${s.status === 'Sudah' ? 'bg-sage-100' : 'bg-red-50'}`}><option>Belum</option><option>Sudah</option></select></td>
                <td className="p-4"><div className="flex justify-center gap-3"><button onClick={() => handleEdit(s)} className="text-gray-400 hover:text-blue-500"><Edit size={18} /></button><button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}