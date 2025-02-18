import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome, FaBuilding, FaCalendarAlt, FaLightbulb, FaUsers, FaUserAlt,
  FaClipboardList, FaUserCheck, FaHouseUser, FaClipboard, FaChevronDown
} from 'react-icons/fa';
import axios from 'axios';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css'; // Import Accordion styles
import './Sidebar.css';

const Sidebar = ({ onClick }) => {
  const [userRole, setUserRole] = useState(null);
  const [societyId, setSocietyId] = useState(null);
  const [regularEntries, setRegularEntries] = useState([]); 
  useEffect(() => {
    // Fetch user role and society ID from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
      setSocietyId(userData.societyId || null);
    }
  }, []);

  useEffect(() => {
    if (societyId) {
      const fetchRegularEntries = async () => {
        try {
          const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/society/get-entries/${societyId}`);
          
          // ✅ Filter only "Regular" entries
          const regularEntriesData = response.data.entries.filter(entry => entry.entryType === 'regular');
          setRegularEntries(regularEntriesData);
        } catch (error) {
          console.error('Error fetching regular entries:', error);
        }
      };

      fetchRegularEntries();
    }
  }, [societyId]);

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
            {/* ✅ Regular Entries with Accordion */}
 <li className="menu-item">
 <Accordion allowZeroExpanded>
   <AccordionItem>
     <AccordionItemHeading>
       <AccordionItemButton className="menu-link accordion-button">
         <FaClipboardList className="menu-icon" />
         Regular Entries
         <FaChevronDown className="accordion-chevron" />
       </AccordionItemButton>
     </AccordionItemHeading>
     <AccordionItemPanel>
       <ul className="regular-entries-list">
         {regularEntries.length > 0 ? (
           regularEntries.map((entry) => (
             <li key={entry.id} className="regular-entry-item">
               <NavLink to={`/regular-entries/${entry.id}`} className="regular-entry-link">
  {entry.title}
</NavLink>
             </li>
           ))
         ) : (
           <li className="no-entries-message">No regular entries found.</li>
         )}
       </ul>
     </AccordionItemPanel>
   </AccordionItem>
 </Accordion>
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
 