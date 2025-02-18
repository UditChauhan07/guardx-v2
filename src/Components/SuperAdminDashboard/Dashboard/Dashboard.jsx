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
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Metrics for SuperAdmin
  const [totalSocieties, setTotalSocieties] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPurposes, setTotalPurposes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Metrics for Other Users
  const [totalRegularEntries, setTotalRegularEntries] = useState(0);
  const [totalHouseList, setTotalHouseList] = useState(0);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Total Counts',
      data: [],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    }],
  });

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };

  useEffect(() => {
    // Fetch role from localStorage
    const storedUser = localStorage.getItem('user');
    let userData = null;
    if (storedUser) {
      userData = JSON.parse(storedUser);
      setUserRole(userData.role);
    }
  
    const fetchData = async () => {
      try {
        if (userData && userData.role === 'superadmin') {
          const societiesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-societies');
          const entriesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-type-of-entries');
          const purposesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-purposes');
          const usersResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-users');
  
          setTotalSocieties(societiesResponse.data.societies.length);
          setTotalEntries(entriesResponse.data.entries.length);
          setTotalPurposes(purposesResponse.data.purposes.length);
          setTotalUsers(usersResponse.data.users.length);
  
          setChartData({
            labels: ['Societies', 'Entries', 'Users', 'Purposes'],
            datasets: [{
              label: 'Total Counts',
              data: [
                societiesResponse.data.societies.length,
                entriesResponse.data.entries.length,
                usersResponse.data.users.length,
                purposesResponse.data.purposes.length
              ],
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
            }],
          });
        } else {
          const regularEntriesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-regular-entries');
          const houseListResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-house-list');
          const entriesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-type-of-entries');
          const purposesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-purposes');
  
          setTotalRegularEntries(regularEntriesResponse.data.entries.length);
          setTotalHouseList(houseListResponse.data.houses.length);
          setTotalEntries(entriesResponse.data.entries.length);
          setTotalPurposes(purposesResponse.data.purposes.length);
  
          setChartData({
            labels: ['Regular Entries', 'Type of Entries', 'Purpose', 'House List'],
            datasets: [{
              label: 'Total Counts',
              data: [
                regularEntriesResponse.data.entries.length,
                entriesResponse.data.entries.length,
                purposesResponse.data.purposes.length,
                houseListResponse.data.houses.length
              ],
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
            }],
          });
        }
        setLoading(false);
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
          {userRole === 'superadmin' ? (
            <>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalSocieties}</strong><p>Societies</p></div>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalEntries}</strong><p>Type of Entries</p></div>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalUsers}</strong><p>Users</p></div>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalPurposes}</strong><p>Purposes</p></div>
            </>
          ) : (
            <>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalRegularEntries}</strong><p>Regular Entries</p></div>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalEntries}</strong><p>Type of Entries</p></div>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalPurposes}</strong><p>Purpose</p></div>
              <div className="metric-card"><strong>{loading ? 'Loading...' : totalHouseList}</strong><p>House List</p></div>
            </>
          )}
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
