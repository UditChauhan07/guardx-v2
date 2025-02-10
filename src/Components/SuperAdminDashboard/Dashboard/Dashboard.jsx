import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import axios from 'axios';
import './Dashboard.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [moduleTitle, setModuleTitle] = useState('Dashboard');
  const [totalSocieties, setTotalSocieties] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPurposes, setTotalPurposes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState({
    labels: ['Societies', 'Entries', 'Users', 'Purposes'],
    datasets: [{
      label: 'Total Counts',
      data: [0, 0, 0, 0],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    }],
  });

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const societiesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-societies');
        const entriesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-type-of-entries');
        const purposesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-purposes');
        const usersResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-users');

        const societies = societiesResponse.data.societies;
        const entries = entriesResponse.data.entries;
        const purposes = purposesResponse.data.purposes;
        const users = usersResponse.data.users;

        setTotalSocieties(societies.length);
        setTotalEntries(entries.length);
        setTotalPurposes(purposes.length);
        setTotalUsers(users.length);
        setLoading(false);

        // Set chart data
        setChartData({
          labels: ['Societies', 'Entries', 'Users', 'Purposes'],
          datasets: [{
            label: 'Total Counts',
            data: [societies.length, entries.length, users.length, purposes.length],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />

      <div className="dashboard-content">
        {/* Metrics Section (Boxes) */}
        <div className="metrics">
          <div className="metric-card">
            <strong>{loading ? 'Loading...' : totalSocieties}</strong>
            <p>Society</p>
          </div>
          <div className="metric-card">
            <strong>{loading ? 'Loading...' : totalEntries}</strong>
            <p>Type of Entries</p>
          </div>
          <div className="metric-card">
            <strong>{loading ? 'Loading...' : totalUsers}</strong>
            <p>User</p>
          </div>
          <div className="metric-card">
            <strong>{loading ? 'Loading...' : totalPurposes}</strong>
            <p>Purpose</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="graph-section">
          <h3>Metrics Graph</h3>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
