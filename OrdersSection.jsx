import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function InquiriesChart({ inquiries, periodDays }) {
  // Group inquiries by date
  const grouped = {};
  inquiries.forEach((inq) => {
    const date = format(new Date(inq.created_date), 'yyyy-MM-dd');
    grouped[date] = (grouped[date] || 0) + 1;
  });

  const chartData = Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Inquiries over time</h3>
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No data for selected period
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Inquiries over time</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickFormatter={(d) => format(parseISO(d), 'dd.MM')}
          />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
          <Tooltip
            labelFormatter={(d) => format(parseISO(d), 'dd.MM.yyyy')}
            contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
          />
          <Bar dataKey="count" name="Inquiries" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}