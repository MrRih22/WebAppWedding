import React, { useContext, useState } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { Plus, Trash2, PhoneCall } from 'lucide-react';

export default function ContactInfo() {
  const { contacts, setContacts } = useContext(WeddingContext);
  const [newContact, setNewContact] = useState({ nama: '', role: '', noHp: '', notes: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setContacts([...contacts, { ...newContact, id: Date.now() }]);
    setNewContact({ nama: '', role: '', noHp: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50">
        <h3 className="text-lg font-bold text-sage-900 mb-4">Direktori Kontak Vendor & Pihak Terkait</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="text" placeholder="Nama Vendor/Orang" required className="p-3 border rounded-lg text-sm" value={newContact.nama} onChange={e => setNewContact({...newContact, nama: e.target.value})} />
          <input type="text" placeholder="Role (Catering, MUA, dll)" required className="p-3 border rounded-lg text-sm" value={newContact.role} onChange={e => setNewContact({...newContact, role: e.target.value})} />
          <input type="text" placeholder="No. HP / WhatsApp" required className="p-3 border rounded-lg text-sm" value={newContact.noHp} onChange={e => setNewContact({...newContact, noHp: e.target.value})} />
          <input type="text" placeholder="Catatan Tambahan" className="p-3 border rounded-lg text-sm" value={newContact.notes} onChange={e => setNewContact({...newContact, notes: e.target.value})} />
          <button type="submit" className="bg-sage-500 text-white p-3 rounded-lg hover:bg-sage-900 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} /> Simpan
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-sage-100 hover:shadow-md transition-all relative">
            <button onClick={() => setContacts(contacts.filter(item => item.id !== c.id))} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
            <div className="text-xs font-bold text-gold-600 bg-gold-50 inline-block px-2 py-1 rounded-md mb-2">{c.role}</div>
            <h4 className="text-lg font-bold text-sage-900 mb-1">{c.nama}</h4>
            <a href={`https://wa.me/${c.noHp.replace(/^0/, '62').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sage-500 hover:text-sage-900 font-medium mb-3 text-sm">
              <PhoneCall size={16} /> {c.noHp}
            </a>
            {c.notes && <p className="text-sm text-gray-500 border-t pt-3 border-gray-100">{c.notes}</p>}
          </div>
        ))}
        {contacts.length === 0 && <div className="text-gray-400 col-span-full p-4">Belum ada kontak yang ditambahkan.</div>}
      </div>
    </div>
  );
}