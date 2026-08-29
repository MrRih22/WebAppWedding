import React, { useContext } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const { budgets, rencanaDana, setRencanaDana, danaTerkumpul } = useContext(WeddingContext);

  // 1. Kalkulasi Dasar dari Budget
  const totalActual = budgets.reduce((acc, curr) => acc + Number(curr.aktual || 0), 0);
  const totalDibayar = budgets.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0);
  
  // 2. RUMUS BARU: Sisa Dana = Dana Terkumpul - Budget Telah Dibayar
  const sisaUangTerkumpul = Number(danaTerkumpul) - totalDibayar;
  
  // 3. RUMUS BARU: Kurang Dana = Target Rencana - Dana Terkumpul
  const kurangDana = Number(rencanaDana) > Number(danaTerkumpul) 
    ? Number(rencanaDana) - Number(danaTerkumpul) 
    : 0;

  const chartData = [
    { 
      name: 'Status Finansial', 
      'Target Dana': Number(rencanaDana || 0), 
      'Terkumpul (Tabungan + Dibayar)': Number(danaTerkumpul || 0), 
      'Total Kebutuhan Aktual': totalActual, 
      'Telah Dibayar': totalDibayar 
    }
  ];

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const MetricCard = ({ title, value, color, subtitle, isWarning }) => (
    <div className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border ${isWarning ? 'border-red-100 bg-red-50' : 'border-sage-50'} hover:shadow-md transition-shadow flex flex-col justify-between`}>
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h4 className={`text-xl md:text-2xl font-bold ${color}`}>{formatIDR(value)}</h4>
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-2 font-medium">{subtitle}</p>}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-serif text-sage-900 mb-6">Ringkasan Eksekutif</h2>
      
      {/* Input Target Rencana Dana */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 mb-8 bg-gradient-to-r from-sage-50 to-white">
        <label className="block text-sm font-bold text-sage-900 mb-2">Target Rencana Dana</label>
        <div className="relative md:w-1/2">
          <span className="absolute left-4 top-3 text-gray-500 font-medium">Rp</span>
          <input 
            type="number" 
            value={rencanaDana} 
            onChange={(e) => setRencanaDana(e.target.value)} 
            className="w-full pl-12 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 outline-none transition-all font-medium text-gray-700" 
            placeholder="0" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard 
          title="Target Rencana Dana" 
          value={rencanaDana} 
          color="text-sage-900" 
        />
        <MetricCard 
          title="Dana Terkumpul" 
          value={danaTerkumpul} 
          color="text-gold-500" 
          subtitle="Tabungan + Telah Dibayar" 
        />
        <MetricCard 
          title="Kurang Dana" 
          value={kurangDana} 
          color="text-red-500" 
          subtitle="Target dikurangi Dana Terkumpul" 
          isWarning={kurangDana > 0} 
        />
        <MetricCard 
          title="Total Kebutuhan Aktual" 
          value={totalActual} 
          color="text-gray-700" 
          subtitle="Berdasarkan pengeluaran Budget" 
        />
        <MetricCard 
          title="Sisa Dana Tersedia" 
          value={sisaUangTerkumpul} 
          color={sisaUangTerkumpul < 0 ? "text-red-500" : "text-sage-500"} 
          subtitle="Terkumpul dikurangi Telah Dibayar" 
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 h-[400px]">
        <h3 className="text-lg font-bold text-sage-900 mb-6">Perbandingan Kesiapan Finansial</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECE8" />
            <XAxis dataKey="name" stroke="#879A83" />
            <YAxis stroke="#879A83" tickFormatter={(value) => `Rp${value / 1000000}M`} />
            <Tooltip formatter={(value) => formatIDR(value)} cursor={{fill: '#F4F6F4'}} />
            <Legend />
            <Bar dataKey="Target Dana" fill="#2C362A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Terkumpul (Tabungan + Dibayar)" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Total Kebutuhan Aktual" fill="#E9ECE8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Telah Dibayar" fill="#879A83" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}  