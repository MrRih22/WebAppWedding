import React, { useContext, useState, useEffect } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Check } from 'lucide-react';

export default function Dashboard() {
  const { budgets = [], rencanaDana = 0, setRencanaDana, danaTerkumpul = 0 } = useContext(WeddingContext) || {};
  
  // State lokal agar input bisa diketik dengan lancar sebelum disimpan
  const [inputValue, setInputValue] = useState(rencanaDana);

  useEffect(() => {
    setInputValue(rencanaDana);
  }, [rencanaDana]);

  const handleSaveTarget = (e) => {
    e.preventDefault();
    if (setRencanaDana) {
      setRencanaDana(inputValue);
    }
  };

  const totalActual = budgets.reduce((acc, curr) => acc + Number(curr.aktual || 0), 0);
  const totalDibayar = budgets.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0);
  
  const sisaUangTerkumpul = Number(danaTerkumpul) - totalDibayar;
  const kurangDana = Number(rencanaDana) > Number(danaTerkumpul) ? Number(rencanaDana) - Number(danaTerkumpul) : 0;

  const chartData = [
    { name: 'Status Finansial', 'Target Dana': Number(rencanaDana), 'Terkumpul': Number(danaTerkumpul), 'Kebutuhan': totalActual, 'Dibayar': totalDibayar }
  ];

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  const MetricCard = ({ title, value, color, subtitle, isWarning }) => (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border ${isWarning ? 'border-red-100 bg-red-50' : 'border-sage-50'} flex flex-col justify-between`}>
      <div><p className="text-sm text-gray-500 mb-1">{title}</p><h4 className={`text-xl font-bold ${color}`}>{formatIDR(value)}</h4></div>
      {subtitle && <p className="text-xs text-gray-400 mt-2 font-medium">{subtitle}</p>}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-serif text-sage-900 mb-6">Ringkasan Eksekutif</h2>
      
      {/* Bungkus dengan form agar tombol Enter bisa berfungsi untuk menyimpan */}
      <form onSubmit={handleSaveTarget} className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 mb-8 bg-gradient-to-r from-sage-50 to-white">
        <label className="block text-sm font-bold text-sage-900 mb-2">Target Rencana Dana (Tekan Enter atau Simpan)</label>
        <div className="flex gap-3 md:w-2/3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3 text-gray-500 font-medium">Rp</span>
            <input 
              type="number" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              className="w-full pl-12 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 outline-none font-medium" 
              placeholder="0" 
            />
          </div>
          <button type="submit" className="bg-sage-500 text-white px-5 py-3 rounded-xl hover:bg-sage-900 transition-colors flex items-center gap-2 font-medium text-sm">
            <Check size={18} /> Simpan Target
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard title="Target Rencana" value={rencanaDana} color="text-sage-900" />
        <MetricCard title="Dana Terkumpul" value={danaTerkumpul} color="text-gold-500" subtitle="Tabungan + Telah Dibayar" />
        <MetricCard title="Kurang Dana" value={kurangDana} color="text-red-500" subtitle="Target dikurangi Terkumpul" isWarning={kurangDana > 0} />
        <MetricCard title="Kebutuhan Aktual" value={totalActual} color="text-gray-700" subtitle="Total budget aktual" />
        <MetricCard title="Sisa Dana Tersedia" value={sisaUangTerkumpul} color={sisaUangTerkumpul < 0 ? "text-red-500" : "text-sage-500"} subtitle="Terkumpul - Telah Dibayar" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 h-[400px]">
        <h3 className="text-lg font-bold text-sage-900 mb-6">Grafik Finansial</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECE8" />
            <XAxis dataKey="name" stroke="#879A83" />
            <YAxis stroke="#879A83" tickFormatter={(value) => `Rp${value/1000000}M`} />
            <Tooltip formatter={(value) => formatIDR(value)} />
            <Legend />
            <Bar dataKey="Target Dana" fill="#2C2A36" />
            <Bar dataKey="Terkumpul" fill="#0045C5" />
            <Bar dataKey="Kebutuhan" fill="#FFE600" />
            <Bar dataKey="Dibayar" fill="#2BFF00" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
