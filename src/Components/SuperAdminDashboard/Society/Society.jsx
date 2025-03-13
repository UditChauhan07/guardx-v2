import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import './Society.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaFileImport, FaFileExport, FaShareAlt, FaChevronDown } from 'react-icons/fa';import { toast } from 'react-toastify';

const Society = () => {
  
  const [societies, setSocieties] = useState([]);
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [showShareOptions, setShowShareOptions] = useState(false); 
  const [file, setFile] = useState(null); 
  const [moduleTitle, setModuleTitle] = useState('Society Details');
  const navigate = useNavigate()
  const handleSidebarClick = (title) => {
    setModuleTitle(title);  
  };
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-societies');
        const societiesWithFormattedDate = response.data.societies.map(society => {
          let formattedDate = 'N/A';
          if (society.createdAt) {
            if (typeof society.createdAt === 'object' && society.createdAt._seconds) {
              formattedDate = new Date(society.createdAt._seconds * 1000).toLocaleDateString();
            } else if (typeof society.createdAt === 'string') {
              formattedDate = new Date(society.createdAt).toLocaleDateString();
            }
          }
          return {
            ...society,
            createdAt: formattedDate
          };
        });
  
        setSocieties(societiesWithFormattedDate);
        setFilteredSocieties(societiesWithFormattedDate);
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
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app
/api/delete-society/${selectedSociety.id}`);
      toast.success('Society deleted successfully!');
      setFilteredSocieties(filteredSocieties.filter(society => society.id !== selectedSociety.id)); 
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Error deleting society');
      console.error(error);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/download-societies?format=${format}`, { responseType: 'blob' });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `societies.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Societies exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error(`Error exporting societies as ${format.toUpperCase()}.`);
      console.error(error);
    }
  };
const handleImportClick = () => {
  navigate('/addexcelsociety'); // Redirect to AddExcelSociety Page
};

  return (
    <div className="society-container">
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />

      <div className="society-content">
        {/* Filters and Add Button */}
        <div className="filters-and-add">
          <div className="add-button-container">
            <Link to="/add-society">
              <button className="add-button">Add Society</button>
            </Link>
            {/* Share Button */}
            <div className="share-container">
              <button className="share-button" onClick={() => setShowShareOptions(!showShareOptions)}>
                <FaShareAlt /> Share <FaChevronDown />
              </button>

              {/* Dropdown for Export Options */}
              {showShareOptions && (
                <div className="share-dropdown">
                  <button className="import-button" onClick={handleImportClick}>
                    <FaFileImport /> Import Excel
                  </button>
                  <button className="export-button" onClick={() => handleExport('xlsx')}>
                    <FaFileExport /> Export Excel
                  </button>
                  <button className="export-button" onClick={() => handleExport('csv')}>
                    <FaFileExport /> Export CSV
                  </button>
                </div>
              )}
            </div>
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
                  <FaEye className="view-icon" onClick={() => window.location.href = `/society-details/${society.id}`} />
                  <Link to={`/edit-society/${society.id}`}>
                    <FaEdit className="edit-icon" />
                  </Link>
                  <FaTrash className="delete-icon" onClick={() => {
                    setSelectedSociety(society); 
                    setShowDeleteConfirm(true);
                  }} />
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
