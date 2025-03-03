import React from 'react';
import { useNavigate } from 'react-router-dom';
import Guard_Navbar from './Guard_Navbar/Guard_Navbar';
import styles from './style.module.css';

const Guard_Dashboard = () => {
  const navigate = useNavigate();

  return (
   <>
   <Guard_Navbar />
    <div className={styles.dashboardContainer}>
      
      <h2 className={styles.heading}>👮 Guard Dashboard</h2>

      <div className={styles.boxContainer}>
        {/* ✅ Visitors List Box */}
        <div className={styles.box} onClick={() => navigate('/visitors_list')}>
          <h3>📋 All Visitors List</h3>
          <p>View and manage all visitor entries.</p>
        </div>

        {/* ✅ Add Visitor Box */}
        <div className={styles.box} onClick={() => navigate('/add_visitor')}>
          <h3>➕ Add Visitor</h3>
          <p>Register a new visitor quickly.</p>
        </div>
      </div>
    </div></>
  );
};

export default Guard_Dashboard;
