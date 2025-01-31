import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBuilding, FaCalendarAlt, FaLightbulb, FaUsers, FaUserAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onClick }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img className="sidebar-logo" src='/logo.png'/>
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item">
          <NavLink
            to="/dashboard"
            className="menu-link"
            activeClassName="active"
            onClick={() => onClick('Dashboard')}
          >
            <FaHome className="menu-icon" />
            Dashboard
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/society"
            className="menu-link"
            activeClassName="active"
            onClick={() => onClick('Society')} 
          >
            <FaBuilding className="menu-icon" />
            Society
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/type-of-entries"
            className="menu-link"
            activeClassName="active"
            onClick={() => onClick('Type of Entries')} 
          >
            <FaCalendarAlt className="menu-icon" />
            Type of Entries
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/purpose"
            className="menu-link"
            activeClassName="active"
            onClick={() => onClick('Purpose of Occasional')} 
          >
            <FaLightbulb className="menu-icon" />
            Purpose of Occasional
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/users"
            className="menu-link"
            activeClassName="active"
            onClick={() => onClick('Users')} 
          >
            <FaUsers className="menu-icon" />
            Users
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink
            to="/roles"
            className="menu-link"
            activeClassName="active"
            onClick={() => onClick('Roles')}
          >
            <FaUserAlt className="menu-icon" />
            Roles
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
