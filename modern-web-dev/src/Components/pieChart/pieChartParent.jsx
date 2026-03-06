import React, { useState, useEffect } from 'react';
import PieChart from './pieChartChild';
import { getMusic } from '../../Services/getMusic/getMusic';

export default function PieChartParent() {
  const [chart, setChart] = useState([]);
  const [newParameter, setParameter] = useState('genre');

  useEffect(() => {
    getMusic().then((data) => {
      setChart(data.songs || []);
    });
  }, []);

  function updateParameter(param) {
    setParameter(param);
  }

  const pieElements = chart.map((e) => e[newParameter]);

  const counts = pieElements.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(counts).map(([key, value]) => `${key}: ${value}`);

  return (
    <div className="pieChartParent">
      <PieChart getParameter={updateParameter} pieData={pieChartData} />
    </div>
  );
}
