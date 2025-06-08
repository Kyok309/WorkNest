'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalServices: 0,
    totalAds: 0,
    weeklyPayments: [],
    weeklyJobRequests: [],
    weeklyRatings: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const paymentChartData = {
    labels: stats.weeklyPayments.map(payment => payment.week),
    datasets: [{
      label: 'Төлбөр (₮)',
      data: stats.weeklyPayments.map(payment => payment.amount),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1
    }]
  };

  const jobRequestsChartData = {
    labels: stats.weeklyJobRequests.map(week => week.week),
    datasets: [{
      label: 'Зөвшөөрөөгүй',
      data: stats.weeklyJobRequests.map(week => week.data[0] || 0),
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
    },
    {
      label: 'Зөвшөөрсөн',
      data: stats.weeklyJobRequests.map(week => week.data[1] || 0),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: 'Дууссан',
      data: stats.weeklyJobRequests.map(week => week.data[2] || 0),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    },
    {
      label: 'Цуцалсан',
      data: stats.weeklyJobRequests.map(week => week.data[3] || 0),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },]
  };

  const ratingsChartData = {
    labels: stats.weeklyRatings.map(week => week.week),
    datasets: [{
      label: '1★',
      data: stats.weeklyRatings.map(week => week.distribution[0]),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: '2★',
      data: stats.weeklyRatings.map(week => week.distribution[1]),
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
    },
    {
      label: '3★',
      data: stats.weeklyRatings.map(week => week.distribution[2]),
      backgroundColor: 'rgba(255, 205, 86, 0.5)',
    },
    {
      label: '4★',
      data: stats.weeklyRatings.map(week => week.distribution[3]),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: '5★',
      data: stats.weeklyRatings.map(week => week.distribution[4]),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  };

  return (
    <div className="min-h-screen h-fit p-6">
      <h1 className="text-3xl font-bold mb-8">Хянах самбар</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Нийт үйлчлүүлэгчид</h3>
          <p className="text-3xl font-semibold">{stats.totalClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Нийт үйлчилгээ</h3>
          <p className="text-3xl font-semibold">{stats.totalServices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Нийт зар</h3>
          <p className="text-3xl font-semibold">{stats.totalAds}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Төлбөр</h2>
          <Line data={paymentChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Төлбөр (нэг сараар)'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ажлын хүсэлтүүд</h2>
          <Bar data={jobRequestsChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Ажлын хүсэлтүүд (нэг сараар)'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                stacked: true
              },
              x: {
                stacked: true
              }
            }
          }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Үнэлгээ (долоо хоногоор)</h2>
          <Bar data={ratingsChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Үнэлгээ'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                stacked: true
              },
              x: {
                stacked: false
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;