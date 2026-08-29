import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Mahar() {
  const { mahar, setMahar } = useContext(WeddingContext);
  const [newItem, setNewItem] = useState({ item: '', status: 'Belum', harga: '', keterangan: '' });

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  const handleAdd = (e) => {
    e.preventDefault();
    setMahar([...mahar, { ...newItem, id: Date.now() }]);
    setNewItem({ item: '', status: 'Belum', harga: '', keterangan: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">Daftar Mahar</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Item Mahar" required className="p-3 border rounded-lg text-sm" value={newItem.item} onChange={e => setNewItem({...newItem, item: e.target.value})} />
          <input type="number" placeholder="Harga/Nilai" required className="p-3 border rounded-lg text-sm" value={newItem.harga} onChange={e => setNewItem({...newItem, harga: e.target.value})} />
          <input type="text" placeholder="Keterangan" className="p-3 border rounded-lg text-sm" value={newItem.keterangan} onChange={e => setNewItem({...newItem, keterangan: e.target.value})} />
          <button type="submit" className="bg-sage-500 text-white p-3 rounded-lg hover:bg-sage-900 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} /> Tambah
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sage-50 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-sage-50 text-sage-900">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Item Mahar</th>
              <th className="p-4">Harga / Nilai</th>
              <th className="p-4">Keterangan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mahar.map((m, index) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium text-sage-900">{m.item}</td>
                <td className="p-4 text-gold-600 font-bold">{formatIDR(m.harga)}</td>
                <td className="p-4 text-gray-500">{m.keterangan}</td>
                <td className="p-4">
                  <select value={m.status} onChange={(e) => setMahar(mahar.map(item => item.id === m.id ? { ...item, status: e.target.value } : item))}
                    className={`p-2 rounded-lg text-xs font-semibold ${m.status === 'Sudah' ? 'bg-sage-100 text-sage-900' : 'bg-red-50 text-red-600'}`}>
                    <option value="Belum">Belum</option>
                    <option value="Sudah">Sudah</option>
                  </select>
                </td>
                <td className="p-4"><button onClick={() => setMahar(mahar.filter(item => item.id !== m.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}