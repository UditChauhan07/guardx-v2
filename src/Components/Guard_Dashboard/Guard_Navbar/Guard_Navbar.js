import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaSignOutAlt, FaUserCircle, FaClipboardList } from 'react-icons/fa';
import styles from "./Guard_Navbar.module.css";
import axios from 'axios';
const Guard_Navbar = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [loginTime, setLoginTime] = useState('');
  
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        setLoginTime(storedUser.loginTime);
      }
    }, []);
  
    const handleLogout = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (!storedUser || !storedUser.id) {
        console.error("⚠️ No user found in localStorage.");
        return;
      }
  
      const logoutTime = new Date().toISOString(); 
  
      try {
        // 🔹 **Call API to update logout time in Firebase**
        await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/attendance/logout', {
          userId: storedUser.id,
        });
  
        console.log("✅ Logout time recorded successfully!");
  
        // Store logout time in localStorage (for reference)
        localStorage.setItem('logoutTime', logoutTime);
        
        // Remove user from localStorage
        localStorage.removeItem('user');
  
        // Redirect to login page
        navigate('/');
      } catch (error) {
        console.error("🔥 Error recording logout time:", error);
      }
    };
  
    return (
      <div className={styles.guardDashboard}>
        {/* Navbar */}
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <img className={styles.guard_logo} src='/logo.png' alt="Logo" />
          </div>
          <div className={styles.userIcon} onClick={() => setShowModal(!showModal)}>
            <FaUserCircle size={30} />
          </div>
        </nav>
  
        {/* Profile & Logout Modal */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <FaUserCircle size={50} className={styles.profileIcon} />
                <h3 className={styles.profileName}>{user?.name}</h3>
                <p className={styles.profileRole}>{user?.role}</p>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.infoRow}>
                  <FaEnvelope className={styles.icon} />
                  <p>{user?.email}</p>
                </div>
                <div className={styles.infoRow}>
                  <FaPhone className={styles.icon} />
                  <p>{user?.phone}</p>
                </div>
              </div>
              <div className={styles.modalFooter}>
                {/* 🆕 "My Attendance" Button */}
                <button className={styles.attendanceBtn} onClick={() => navigate('/user-attendance-history')}>
                  <FaClipboardList className={styles.icon} /> My Attendance
                </button>
  
                {/* Logout Button */}
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <FaSignOutAlt className={styles.logoutIcon} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default Guard_Navbar
