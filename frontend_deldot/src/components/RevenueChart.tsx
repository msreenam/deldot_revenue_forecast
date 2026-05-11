import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine,
  Legend
} from 'recharts';
import { YearlyRevenue } from '../types/policy';

interface RevenueChartProps {
  data: YearlyRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="w-full h-[450px] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#004a99]">25-Year Revenue Horizon</h3>
          <p className="text-sm text-gray-500">Gross vs. Net Revenue Projections (2025-2050)</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#004a99" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#004a99" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc72c" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ffc72c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            dy={10}
            interval={4}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Legend verticalAlign="top" height={36}/>
          <Area 
            name="Gross Revenue"
            type="monotone" 
            dataKey="gross" 
            stroke="#004a99" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorGross)" 
          />
          <Area 
            name="Net Revenue"
            type="monotone" 
            dataKey="net" 
            stroke="#ffc72c" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorNet)" 
          />
          <ReferenceLine x={2025} stroke="#94a3b8" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
