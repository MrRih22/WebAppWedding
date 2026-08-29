import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2 } from 'lucide-react';

export default function GuestList() {
  const { guests, setGuests } = useContext(WeddingContext);
  const [newGuest, setNewGuest] = useState({ nama: '', pihak: 'Azzam', hubungan: '', alamat: '', status: 'Belum Dikirim' });

  const handleAdd = (e) => {
    e.preventDefault();
    setGuests([...guests, { ...newGuest, id: Date.now() }]);
    setNewGuest({ nama: '', pihak: 'Azzam', hubungan: '', alamat: '', status: 'Belum Dikirim' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">Daftar Tamu</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Nama Tamu" required className="p-3 border rounded-lg text-sm" value={newGuest.nama} onChange={e => setNewGuest({...newGuest, nama: e.target.value})} />
          <select className="p-3 border rounded-lg text-sm" value={newGuest.pihak} onChange={e => setNewGuest({...newGuest, pihak: e.target.value})}>
            <option value="Azzam">Tamu Azzam</option><option value="Irma">Tamu Irma</option>
          </select>
          <input type="text" placeholder="Hubungan / Alamat" required className="p-3 border rounded-lg text-sm" value={newGuest.hubungan} onChange={e => setNewGuest({...newGuest, hubungan: e.target.value})} />
          <button type="submit" className="bg-sage-500 text-white p-3 rounded-lg flex justify-center gap-2 md:col-span-3"><Plus size={18} /> Tambah Tamu</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto border border-sage-50">
        <table className="w-full text-sm text-left">
          <thead className="bg-sage-50 text-sage-900"><tr><th className="p-4">Nama</th><th className="p-4">Pihak</th><th className="p-4">Detail</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {guests.map(g => (
              <tr key={g.id}>
                <td className="p-4 font-medium">{g.nama}</td>
                <td className="p-4 text-xs font-bold text-gold-600">{g.pihak}</td>
                <td className="p-4">{g.hubungan}</td>
                <td className="p-4"><select value={g.status} onChange={(e) => setGuests(guests.map(item => item.id === g.id ? { ...item, status: e.target.value } : item))} className="p-2 rounded-lg text-xs bg-gray-100"><option>Belum Dikirim</option><option>Sudah Dikirim</option></select></td>
                <td className="p-4"><button onClick={() => setGuests(guests.filter(item => item.id !== g.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}