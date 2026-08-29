import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function TaskTracker() {
  const { tasks = [], setTasks } = useContext(WeddingContext) || {};
  const [newItem, setNewItem] = useState({ jenis: '', pic: 'Azzam', deadline: '', status: 'Belum' });

  const handleAdd = async (e) => {
    e.preventDefault();
    const dataToInsert = { ...newItem, id: Date.now() };
    const { error } = await supabase.from('tasks').insert([dataToInsert]);
    if (!error) {
      setTasks([...tasks, dataToInsert]);
      setNewItem({ jenis: '', pic: 'Azzam', deadline: '', status: 'Belum' });
    } else {
      alert("Gagal menambah tugas: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // Fungsi siklus status: Belum -> In Progress -> Selesai -> Belum
  const handleStatusCycle = async (item) => {
    let nextStatus = 'Belum';
    if (item.status === 'Belum') nextStatus = 'In Progress';
    else if (item.status === 'In Progress') nextStatus = 'Selesai';
    else if (item.status === 'Selesai') nextStatus = 'Belum';

    const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', item.id);
    if (!error) {
      setTasks(tasks.map(t => t.id === item.id ? { ...t, status: nextStatus } : t));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">Tambah Tugas Baru (Cloud)</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input type="text" placeholder="Nama Tugas" required className="p-3 border rounded-lg text-sm md:col-span-2 outline-none focus:ring-2 focus:ring-sage-500" value={newItem.jenis} onChange={e => setNewItem({...newItem, jenis: e.target.value})} />
          <select className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.pic} onChange={e => setNewItem({...newItem, pic: e.target.value})}>
            <option value="Azzam">Azzam</option>
            <option value="Irma">Irma</option>
            <option value="Bersama">Bersama</option>
          </select>
          <input type="date" required className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.deadline} onChange={e => setNewItem({...newItem, deadline: e.target.value})} />
          
          <select className="p-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-sage-500" value={newItem.status} onChange={e => setNewItem({...newItem, status: e.target.value})}>
            <option value="Belum">Belum</option>
            <option value="In Progress">In Progress</option>
            <option value="Selesai">Selesai</option>
          </select>

          <button type="submit" className="bg-sage-500 text-white p-3 rounded-lg hover:bg-sage-900 flex items-center justify-center gap-2 font-medium transition-colors">
            <Plus size={18} /> Tambah
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-sage-50">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-sage-50 text-sage-900">
            <tr>
              <th className="p-4">Tugas</th>
              <th className="p-4">PIC</th>
              <th className="p-4">Deadline</th>
              <th className="p-4">Status (Klik untuk ubah)</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks?.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-sage-900">{t.jenis}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${t.pic === 'Azzam' ? 'bg-blue-50 text-blue-600' : t.pic === 'Irma' ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                    {t.pic}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{t.deadline}</td>
                <td className="p-4">
                  <button 
                    onClick={() => handleStatusCycle(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      t.status === 'Selesai' 
                        ? 'bg-sage-100 text-sage-800' 
                        : t.status === 'In Progress' 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }`}
                  >
                    {t.status === 'Selesai' && <CheckCircle size={14} />}
                    {t.status === 'In Progress' && <AlertCircle size={14} />}
                    {t.status === 'Belum' && <Clock size={14} />}
                    {t.status}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {(!tasks || tasks.length === 0) && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">Belum ada tugas yang dicatat.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
