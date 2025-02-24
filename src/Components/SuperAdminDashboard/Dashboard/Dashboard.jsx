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
  const [userData, setUserData] = useState(null);

  // Metrics for SuperAdmin
  const [totalSocieties, setTotalSocieties] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPurposes, setTotalPurposes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Metrics for Other Users
  const [totalRegularEntries, setTotalRegularEntries] = useState(0);
  // For non-superadmin, totalEntries represents all society entries
  const [totalHouseList, setTotalHouseList] = useState(0);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Total Counts',
      data: [],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1,
    }],
  });

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };

  // First, load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      console.log('User Data:', parsedUser); // Debug: verify user object
    }
  }, []);

  // Once userData is available, fetch the metrics
  useEffect(() => {
    if (!userData) return;

    const fetchData = async () => {
      try {
        if (userData.role === 'superadmin') {
          // Global endpoints for SuperAdmin
          const [societiesResponse, entriesResponse, purposesResponse, usersResponse] =
            await Promise.all([
              axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-societies'),
              axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-type-of-entries'),
              axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-purposes'),
              axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-users')
            ]);
  
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
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1,
            }],
          });
        } else {
          // For non-superadmin users, use society-specific endpoints
          let regularEntriesCount = 0;
          let allEntriesCount = 0;
          let purposesCount = 0;
          let housesCount = 0;
  
          if (userData.societyId) {
            // Fetch all entries for the society
            const societyEntriesResponse = await axios.get(
              `https://api-kpur6ixuza-uc.a.run.app/api/society/get-entries/${userData.societyId}`
            );
            const societyEntriesData = societyEntriesResponse.data.entries;
            allEntriesCount = societyEntriesData.length;
            regularEntriesCount = societyEntriesData.filter(
              entry => entry.entryType === 'regular'
            ).length;
  
            // Fetch purposes specific to the society
            const societyPurposesResponse = await axios.get(
              `https://api-kpur6ixuza-uc.a.run.app/api/society/get-purposes/${userData.societyId}`
            );
            purposesCount = societyPurposesResponse.data.purposes.length;
  
            // Fetch houses specific to the society
            const housesResponse = await axios.get(
              `https://api-kpur6ixuza-uc.a.run.app/api/get-houses/${userData.societyId}`
            );
            housesCount = housesResponse.data.houses.length;
  
            // Set metrics based on society data
            setTotalRegularEntries(regularEntriesCount);
            setTotalEntries(allEntriesCount); // Represents all society entries
            setTotalPurposes(purposesCount);
            setTotalHouseList(housesCount);
          }
  
          setChartData({
            labels: ['Regular Entries', 'All Entries', 'Purpose', 'House List'],
            datasets: [{
              label: 'Total Counts',
              data: [
                regularEntriesCount,
                allEntriesCount,
                purposesCount,
                housesCount
              ],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
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
  }, [userData]);
  
  return (
    <div className="dashboard-container">
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
  
      <div className="dashboard-content">
        {/* Metrics Section (Boxes) */}
        <div className="metrics">
          {userData?.role === 'superadmin' ? (
            <>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalSocieties}</strong>
                <p>Societies</p>
              </div>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalEntries}</strong>
                <p>Entries</p>
              </div>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalUsers}</strong>
                <p>Users</p>
              </div>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalPurposes}</strong>
                <p>Purposes</p>
              </div>
            </>
          ) : (
            <>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalRegularEntries}</strong>
                <p>Regular Entries</p>
              </div>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalEntries}</strong>
                <p>All Entries</p>
              </div>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalPurposes}</strong>
                <p>Purpose</p>
              </div>
              <div className="metric-card">
                <strong>{loading ? 'Loading...' : totalHouseList}</strong>
                <p>House List</p>
              </div>
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
