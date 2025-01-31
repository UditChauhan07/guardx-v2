import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import axios from 'axios'; // Make sure axios is imported
import './Dashboard.css';

const Dashboard = () => {
  const [moduleTitle, setModuleTitle] = useState('Dashboard');
  const [totalSocieties, setTotalSocieties] = useState(0);  // Store the total count here
  const [totalEntries, setTotalEntries] = useState(0);  // Store the total number of entries
  const [loading, setLoading] = useState(true);  // Loading state to handle async fetching

  const handleSidebarClick = (title) => {
    setModuleTitle(title);  
  };

  // Fetch the number of societies and entries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const societiesResponse = await axios.get('http://localhost:5000/api/get-all-societies');
        const entriesResponse = await axios.get('http://localhost:5000/api/get-all-type-of-entries');
        
        const societies = societiesResponse.data.societies; 
        const entries = entriesResponse.data.entries; 
        
        setTotalSocieties(societies.length); 
        setTotalEntries(entries.length);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
      
      <div className="dashboard-content">
        {/* Metrics Section */}
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
            <strong>0</strong>
            <p>User</p>
          </div>
          <div className="metric-card">
            <strong>0</strong>
            <p>Purpose</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
