import React, { useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function PieChartComponent({ getParameter, pieData }) {
  const [selectedParameter, setSelectedParameter] = useState('genre');

  const handleDropdown = (parameter) => {
    setSelectedParameter(parameter);
    if (typeof getParameter === 'function') getParameter(parameter);
  };

  return (
    <div className="parameterDropdownChild">
      <select
        value={selectedParameter}
        onChange={(e) => handleDropdown(e.target.value)}
      >
        <option value="genre">Genre</option>
        <option value="artist">Artist</option>
      </select>

      {Array.isArray(pieData) && pieData.length > 0 ? (
        <div style={{ display: 'inline-block', border: '2px solid #d1d5db', borderRadius: '8px', padding: '8px' }}>
          <ResponsiveContainer width={700} height={700}>
            <PieChart margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
              <Pie
                data={pieData.map((entry, index) => ({ ...entry, fill: COLORS[index % COLORS.length] }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={160}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={true}
              />
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No data to display.</p>
      )}
    </div>
  );
}
