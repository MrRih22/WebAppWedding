import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, Clock } from 'lucide-react';

export default function TaskTracker() {
  const { tasks, setTasks } = useContext(WeddingContext);
  const [newTask, setNewTask] = useState({ jenis: '', pic: 'Azzam', deadline: '', status: 'Belum' });

  const handleAdd = (e) => {
    e.preventDefault();
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ jenis: '', pic: 'Azzam', deadline: '', status: 'Belum' });
  };

  const isDeadlineNear = (dateString) => {
    const diffDays = Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">Tambah Tugas Baru</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Jenis Tugas" required className="flex-1 p-3 border rounded-lg text-sm" value={newTask.jenis} onChange={e => setNewTask({...newTask, jenis: e.target.value})} />
          <select className="p-3 border rounded-lg text-sm" value={newTask.pic} onChange={e => setNewTask({...newTask, pic: e.target.value})}>
            <option value="Azzam">Azzam</option>
            <option value="Irma">Irma</option>
          </select>
          <input type="date" required className="p-3 border rounded-lg text-sm" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
          <button type="submit" className="bg-sage-500 text-white px-6 py-3 rounded-lg hover:bg-sage-900 flex items-center justify-center gap-2"><Plus size={18} /> Tambah</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-sage-50 overflow-hidden">
         <table className="w-full text-sm text-left">
           <thead className="bg-sage-50 text-sage-900"><tr><th className="p-4">Tugas</th><th className="p-4">PIC</th><th className="p-4">Deadline</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
           <tbody className="divide-y divide-gray-100">
             {tasks.map(t => {
               const warning = t.status !== 'Selesai' && isDeadlineNear(t.deadline);
               return (
                 <tr key={t.id} className="hover:bg-gray-50">
                   <td className="p-4 font-medium text-sage-900">{t.jenis}</td>
                   <td className="p-4"><span className="bg-gold-400/20 text-gold-600 px-3 py-1 rounded-full text-xs font-bold">{t.pic}</span></td>
                   <td className="p-4"><span className={`flex items-center gap-2 ${warning ? 'text-red-500 font-bold' : 'text-gray-600'}`}>{warning && <Clock size={16} className="animate-pulse" />} {t.deadline}</span></td>
                   <td className="p-4"><select value={t.status} onChange={(e) => setTasks(tasks.map(item => item.id === t.id ? { ...item, status: e.target.value } : item))} className="p-2 rounded-lg text-xs font-semibold outline-none bg-gray-100"><option>Belum</option><option>In Progress</option><option>Selesai</option></select></td>
                   <td className="p-4"><button onClick={() => setTasks(tasks.filter(item => item.id !== t.id))} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></td>
                 </tr>
               )
             })}
           </tbody>
         </table>
      </div>
    </div>
  );
}