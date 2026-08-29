import React, { useContext } from 'react';
import { WeddingContext } from '../context/WeddingContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const { budgets } = useContext(WeddingContext);

  const totalRencana = budgets.reduce((acc, curr) => acc + Number(curr.rencana || 0), 0);
  const totalActual = budgets.reduce((acc, curr) => acc + Number(curr.aktual || 0), 0);
  const totalDibayar = budgets.reduce((acc, curr) => acc + Number(curr.dibayar || 0), 0);
  const totalBelumDibayar = totalActual - totalDibayar;

  const chartData = [
    { name: 'Budget Summary', Rencana: totalRencana, Aktual: totalActual, Dibayar: totalDibayar }
  ];

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const MetricCard = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h4 className={`text-xl md:text-2xl font-bold ${color}`}>{formatIDR(value)}</h4>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-serif text-sage-900 mb-6">Ringkasan Eksekutif</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Budget Rencana" value={totalRencana} color="text-sage-900" />
        <MetricCard title="Total Budget Aktual" value={totalActual} color="text-gold-500" />
        <MetricCard title="Total Telah Dibayar" value={totalDibayar} color="text-sage-500" />
        <MetricCard title="Total Belum Dibayar" value={totalBelumDibayar} color="text-red-400" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-sage-50 h-[400px]">
        <h3 className="text-lg font-bold text-sage-900 mb-6">Perbandingan Budget</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECE8" />
            <XAxis dataKey="name" stroke="#879A83" />
            <YAxis stroke="#879A83" tickFormatter={(value) => `Rp${value / 1000000}M`} />
            <Tooltip formatter={(value) => formatIDR(value)} cursor={{fill: '#F4F6F4'}} />
            <Legend />
            <Bar dataKey="Rencana" fill="#E9ECE8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Aktual" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Dibayar" fill="#879A83" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}