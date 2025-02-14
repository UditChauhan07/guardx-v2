import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome, FaBuilding, FaCalendarAlt, FaLightbulb, FaUsers, FaUserAlt,
  FaClipboardList, FaUserCheck, FaHouseUser, FaClipboard
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onClick }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
    }
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img className="sidebar-logo" src='/logo.png' alt="Logo"/>
      </div>
      <ul className="sidebar-menu">
        {/* Visible to Everyone */}
        <li className="menu-item">
          <NavLink to="/dashboard" className="menu-link" activeClassName="active" onClick={() => onClick('Dashboard')}>
            <FaHome className="menu-icon" />
            Dashboard
          </NavLink>
        </li>

        {/* Modules for SuperAdmin */}
        {userRole === 'superadmin' ? (
          <>
          <li className="menu-item">
              <NavLink to="/society" className="menu-link" activeClassName="active" onClick={() => onClick('Society')}>
                <FaBuilding className="menu-icon" />
                Society
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/type-of-entries" className="menu-link" activeClassName="active" onClick={() => onClick('Type of Entries')}>
                <FaCalendarAlt className="menu-icon" />
                Type of Entries
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/purpose" className="menu-link" activeClassName="active" onClick={() => onClick('Purpose of Occasional')}>
                <FaLightbulb className="menu-icon" />
                Purpose of Occasional
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/users" className="menu-link" activeClassName="active" onClick={() => onClick('Users')}>
                <FaUsers className="menu-icon" />
                Users
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/roles" className="menu-link" activeClassName="active" onClick={() => onClick('Roles')}>
                <FaUserAlt className="menu-icon" />
                Roles
              </NavLink>
            </li>
            
          </>
        ) : (
          // Modules for Normal Users (all roles except SuperAdmin)
          <>
            <li className="menu-item">
              <NavLink to="/type-of-entries" className="menu-link" activeClassName="active" onClick={() => onClick('Type of Entries')}>
                <FaCalendarAlt className="menu-icon" />
                Type of Entries
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/purpose" className="menu-link" activeClassName="active" onClick={() => onClick('Purpose of Occasional')}>
                <FaLightbulb className="menu-icon" />
                Purpose of Occasional
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/users" className="menu-link" activeClassName="active" onClick={() => onClick('Users')}>
                <FaUsers className="menu-icon" />
                Users
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/roles" className="menu-link" activeClassName="active" onClick={() => onClick('Roles')}>
                <FaUserAlt className="menu-icon" />
                Roles
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/regular-entries" className="menu-link" activeClassName="active" onClick={() => onClick('Regular Entries')}>
                <FaClipboardList className="menu-icon" />
                Regular Entries
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/guest-entries" className="menu-link" activeClassName="active" onClick={() => onClick('Guest Entries Request')}>
                <FaUserCheck className="menu-icon" />
                Guest Entries Request
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/house-list" className="menu-link" activeClassName="active" onClick={() => onClick('House List')}>
                <FaHouseUser className="menu-icon" />
                House List
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/attendance" className="menu-link" activeClassName="active" onClick={() => onClick('Attendance')}>
                <FaClipboard className="menu-icon" />
                Attendance
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
