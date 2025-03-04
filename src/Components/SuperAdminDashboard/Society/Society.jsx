import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import './Society.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Society = () => {
  
  const [societies, setSocieties] = useState([]);
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [moduleTitle, setModuleTitle] = useState('Society Details');
  const [permissions, setPermissions] = useState({ create: true, view: true, edit: true, delete: true });
  const [userRole, setUserRole] = useState(null);
  const [societyId, setSocietyId] = useState(null);
  const handleSidebarClick = (title) => {
    setModuleTitle(title);  
  };
   // Fetch user role, society ID, and permissions from localStorage
   useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
      setSocietyId(userData.societyId || null);
      setPermissions(userData.permissions?.society || { create: true, view: true, edit: true, delete: true });
    }
  }, []);
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-societies');
        setSocieties(response.data.societies);
        setFilteredSocieties(response.data.societies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching societies: ', error);
        setLoading(false);
      }
    };
    fetchSocieties();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterSocieties(value, startDate, endDate);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
    filterSocieties(search, startDate, endDate);
  };

  const filterSocieties = (searchText, start, end) => {
    const filtered = societies.filter(society => {
      const isMatchSearch = society.societyName.toLowerCase().includes(searchText.toLowerCase()) || 
                            society.address.toLowerCase().includes(searchText.toLowerCase());
      
      const isMatchDate = !start && !end ? true : 
                          (new Date(society.createdAt) >= new Date(start) && new Date(society.createdAt) <= new Date(end));
  
      return isMatchSearch && isMatchDate;
    });
    setFilteredSocieties(filtered);
  };

  const handleDeleteSociety = async () => {
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app/api/delete-society/${selectedSociety.id}`);
      toast.success('Society deleted successfully!');
      setFilteredSocieties(filteredSocieties.filter(society => society.id !== selectedSociety.id)); 
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Error deleting society');
      console.error(error);
    }
  };

  return (
    <div className="society-container">
      {/* Navbar */}
      <Navbar moduleTitle={moduleTitle} />
      
      {/* Sidebar */}
      <Sidebar onClick={handleSidebarClick} />

      <div className="society-content">
        {/* Filters and Add Button */}
        <div className="filters-and-add">
          <div className="add-button-container">
          <Link
    to={permissions.create ? "/add-society" : "#"}
    className={permissions.create ? "" : "disabled-link"}
    onClick={(e) => !permissions.create && e.preventDefault()} 
    
  >
    <button className="add-button" disabled={!permissions.create}>Add Society</button>
  </Link>
          </div>
          <div className="filters">
            <input
              type="date"
              className="filter-input"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              placeholder="Start Date"
            />
            <input
              type="date"
              className="filter-input"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              placeholder="End Date"
            />
            <input
              type="text"
              className="filter-input"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by Name or Address"
            />
          </div>
        </div>

        {/* Table */}
        <table className="society-table">
          <thead>
            <tr>
              <th>Society Name</th>
              <th>Address</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSocieties.map((society) => (
              <tr key={society.id}>
                <td>{society.societyName}</td>
                <td>{society.address}</td>
                <td>{society.status}</td>
                <td>{society.createdAt}</td>
                <td>
                <FaEye
                    className="view-icon"
                    onClick={() => {
                      if (permissions.view) {
                        window.location.href = `/society-details/${society.id}`;
                      }
                    }}
                    style={{ opacity: permissions.view ? 1 : 0.5, cursor: permissions.view ? 'pointer' : 'not-allowed' }}
                  />
                  <Link to={`/edit-society/${society.id}`}>
                    <FaEdit
                      className="edit-icon"
                      style={{ opacity: permissions.edit ? 1 : 0.5, cursor: permissions.edit ? 'pointer' : 'not-allowed' }}
                      onClick={(e) => {
                        if (!permissions.edit) e.preventDefault();
                      }}
                    />
                  </Link>
                  <FaTrash
                    className="delete-icon"
                    onClick={() => {
                      if (permissions.delete) {
                        setSelectedSociety(society);
                        setShowDeleteConfirm(true);
                      }
                    }}
                    style={{ opacity: permissions.delete ? 1 : 0.5, cursor: permissions.delete ? 'pointer' : 'not-allowed' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="delete-confirmation-modal">
            <p>Are you sure you want to delete this society?</p>
            <button onClick={handleDeleteSociety}>Yes</button>
            <button onClick={() => setShowDeleteConfirm(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Society;
