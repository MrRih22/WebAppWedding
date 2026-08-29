import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

export default function Seserahan() {
  const { seserahan, setSeserahan } = useContext(WeddingContext);
  const [newItem, setNewItem] = useState({ item: '', status: 'Belum', harga: '', link: '', keterangan: '', qtyRencana: 1, qtyAktual: 0 });

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);

  const handleAdd = (e) => {
    e.preventDefault();
    setSeserahan([...seserahan, { ...newItem, id: Date.now() }]);
    setNewItem({ item: '', status: 'Belum', harga: '', link: '', keterangan: '', qtyRencana: 1, qtyAktual: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">Daftar Seserahan</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Nama Item" required className="p-3 border rounded-lg text-sm md:col-span-2" value={newItem.item} onChange={e => setNewItem({...newItem, item: e.target.value})} />
          <input type="number" placeholder="Harga Satuan" required className="p-3 border rounded-lg text-sm" value={newItem.harga} onChange={e => setNewItem({...newItem, harga: e.target.value})} />
          <input type="url" placeholder="Link Barang (Opsional)" className="p-3 border rounded-lg text-sm" value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} />
          <input type="number" placeholder="Qty Rencana" required className="p-3 border rounded-lg text-sm" value={newItem.qtyRencana} onChange={e => setNewItem({...newItem, qtyRencana: e.target.value})} />
          <input type="number" placeholder="Qty Aktual" className="p-3 border rounded-lg text-sm" value={newItem.qtyAktual} onChange={e => setNewItem({...newItem, qtyAktual: e.target.value})} />
          <input type="text" placeholder="Keterangan" className="p-3 border rounded-lg text-sm" value={newItem.keterangan} onChange={e => setNewItem({...newItem, keterangan: e.target.value})} />
          <button type="submit" className="bg-sage-500 text-white p-3 rounded-lg hover:bg-sage-900 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} /> Tambah
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-sage-50 overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-sage-50 text-sage-900">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Item</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Link</th>
              <th className="p-4">Qty (Rencana / Aktual)</th>
              <th className="p-4">Keterangan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {seserahan.map((s, index) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-medium">{s.item}</td>
                <td className="p-4 text-gold-600">{formatIDR(s.harga)}</td>
                <td className="p-4">{s.link && <a href={s.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1"><ExternalLink size={14}/> Beli</a>}</td>
                <td className="p-4 text-center font-bold">{s.qtyRencana} / {s.qtyAktual}</td>
                <td className="p-4">{s.keterangan}</td>
                <td className="p-4">
                  <select value={s.status} onChange={(e) => setSeserahan(seserahan.map(item => item.id === s.id ? { ...item, status: e.target.value } : item))}
                    className={`p-2 rounded-lg text-xs font-semibold ${s.status === 'Sudah' ? 'bg-sage-100 text-sage-900' : 'bg-red-50 text-red-600'}`}>
                    <option value="Belum">Belum</option>
                    <option value="Sudah">Sudah</option>
                  </select>
                </td>
                <td className="p-4"><button onClick={() => setSeserahan(seserahan.filter(item => item.id !== s.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 