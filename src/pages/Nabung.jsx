import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, PiggyBank } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Nabung() {
  const { savings = [], setSavings, danaTerkumpul = 0, rencanaDana = 0 } = useContext(WeddingContext) || {};
  const [newSaving, setNewSaving] = useState({ nama: 'Azzam', jumlah: '', tanggal: '' });

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(num) || 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    const newId = Date.now();
    const dataToInsert = { ...newSaving, id: newId, jumlah: Number(newSaving.jumlah) };

    const { error } = await supabase.from('savings').insert([dataToInsert]);
    if (!error) {
      setSavings([...savings, dataToInsert]);
      setNewSaving({ nama: 'Azzam', jumlah: '', tanggal: '' });
    } else {
      alert("Gagal menyimpan ke cloud: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('savings').delete().eq('id', id);
    if (!error) {
      setSavings(savings.filter(item => item.id !== id));
    } else {
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-sage-900 p-6 rounded-2xl shadow-sm text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-sage-500 p-3 rounded-full"><PiggyBank size={32} /></div>
          <div><p className="text-sage-100 text-sm">Total Dana Terkumpul</p><h3 className="text-2xl font-bold text-gold-400">{formatIDR(danaTerkumpul)}</h3></div>
        </div>
        <div className="text-right border-l border-sage-500 pl-6 hidden md:block">
          <p className="text-sage-100 text-sm">Target Rencana Dana</p><p className="font-medium text-lg">{formatIDR(rencanaDana)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">Catat Tabungan Baru (Cloud)</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="p-3 border rounded-lg" value={newSaving.nama} onChange={e => setNewSaving({...newSaving, nama: e.target.value})}>
            <option value="Azzam">Azzam</option><option value="Irma">Irma</option>
          </select>
          <input type="number" placeholder="Jumlah Nabung (Rp)" required className="p-3 border rounded-lg" value={newSaving.jumlah} onChange={e => setNewSaving({...newSaving, jumlah: e.target.value})} />
          <input type="date" required className="p-3 border rounded-lg" value={newSaving.tanggal} onChange={e => setNewSaving({...newSaving, tanggal: e.target.value})} />
          <button type="submit" className="bg-sage-500 text-white p-3 rounded-lg hover:bg-sage-900 flex items-center justify-center gap-2 font-medium"><Plus size={18} /> Simpan</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-sage-50">
        <table className="w-full text-sm text-left">
          <thead className="bg-sage-50 text-sage-900"><tr><th className="p-4">No</th><th className="p-4">Nama</th><th className="p-4">Tanggal</th><th className="p-4">Jumlah</th><th className="p-4 text-center">Aksi</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {savings?.map((s, index) => (
              <tr key={s.id}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4 font-bold text-sage-900"><span className={`px-2 py-1 rounded-md text-xs ${s.nama === 'Azzam' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>{s.nama}</span></td>
                <td className="p-4 text-gray-600">{s.tanggal}</td>
                <td className="p-4 font-bold text-sage-600">{formatIDR(s.jumlah)}</td>
                <td className="p-4 text-center"><button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}