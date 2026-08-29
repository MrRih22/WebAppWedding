import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Mahar() {
  const { mahar = [], setMahar } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ item: '', status: 'Belum', harga: '', keterangan: '' });
  const [editId, setEditId] = useState(null);

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(num) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const updated = { ...newItem, id: editId };
      const { error } = await supabase.from('mahar').update(updated).eq('id', editId);
      if (!error) {
        setMahar(mahar.map(m => m.id === editId ? updated : m));
        setEditId(null);
      }
    } else {
      const dataToInsert = { ...newItem, id: Date.now() };
      const { error } = await supabase.from('mahar').insert([dataToInsert]);
      if (!error) {
        setMahar([...mahar, dataToInsert]);
      }
    }
    setNewItem({ item: '', status: 'Belum', harga: '', keterangan: '' });
  };

  const handleEdit = (item) => { setEditId(item.id); setNewItem({ ...item }); };
  const handleDelete = async (id) => {
    const { error } = await supabase.from('mahar').delete().eq('id', id);
    if (!error) setMahar(mahar.filter(m => m.id !== id));
  };

  const handleStatusChange = async (item, newStatus) => {
    const { error } = await supabase.from('mahar').update({ status: newStatus }).eq('id', item.id);
    if (!error) setMahar(mahar.map(m => m.id === item.id ? { ...m, status: newStatus } : m));
  };

  const totalMahar = mahar.reduce((acc, curr) => acc + Number(curr.harga || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-sage-900 p-6 rounded-2xl shadow-sm text-white flex justify-between items-center">
        <div><p className="text-sage-100 text-sm">Total Estimasi Mahar</p><h3 className="text-2xl font-bold text-gold-400">{formatIDR(totalMahar)}</h3></div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">{editId ? 'Edit Mahar' : 'Tambah Mahar'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Nama Mahar (Cth: Emas 10 Gram)" required className="p-3 border rounded-lg text-sm md:col-span-2 outline-none focus:ring-2 focus:ring-sage-500" value={newItem.item} onChange={e => setNewItem({...newItem, item: e.target.value})} />
          <input type="number" placeholder="Perkiraan Harga (Rp)" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.harga} onChange={e => setNewItem({...newItem, harga: e.target.value})} />
          <input type="text" placeholder="Keterangan" className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.keterangan} onChange={e => setNewItem({...newItem, keterangan: e.target.value})} />
          
          <div className="flex gap-2 md:col-span-4">
            <button type="submit" className="flex-1 bg-sage-500 text-white p-3 rounded-lg font-medium hover:bg-sage-900 transition-colors">{editId ? 'Simpan' : '+ Tambah Mahar'}</button>
            {editId && <button type="button" onClick={() => {setEditId(null); setNewItem({ item: '', status: 'Belum', harga: '', keterangan: '' })}} className="bg-gray-100 px-6 rounded-lg font-medium">Batal</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-sage-50">
        <table className="w-full text-sm text-left whitespace-nowrap"><thead className="bg-sage-50 text-sage-900"><tr><th className="p-4">Item Mahar</th><th className="p-4">Harga</th><th className="p-4">Keterangan</th><th className="p-4">Status</th><th className="p-4 text-center">Aksi</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {mahar?.map(m => (
              <tr key={m.id} className="hover:bg-gray-50"><td className="p-4 font-medium text-sage-900">{m.item}</td><td className="p-4 font-bold text-gold-600">{formatIDR(m.harga)}</td><td className="p-4 text-gray-500">{m.keterangan}</td>
                <td className="p-4"><select value={m.status} onChange={(e) => handleStatusChange(m, e.target.value)} className={`p-2 rounded-lg text-xs font-semibold ${m.status === 'Sudah' ? 'bg-sage-100' : 'bg-red-50'}`}><option>Belum</option><option>Sudah</option></select></td>
                <td className="p-4"><div className="flex justify-center gap-3"><button onClick={() => handleEdit(m)} className="text-gray-400 hover:text-blue-500"><Edit size={18} /></button><button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}