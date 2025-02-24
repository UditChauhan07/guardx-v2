import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../SuperAdminDashboard/sidebar/Sidebar';
import styles from './House_list.module.css';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const HouseList = () => {
  const [moduleTitle, setModuleTitle] = useState('House List');
  const [houses, setHouses] = useState([]);
  const [search, setSearch] = useState('');
  const [societyId, setSocietyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch user society ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setSocietyId(userData.societyId);
    }
  }, []);

  // Fetch houses of the user's society
  useEffect(() => {
    if (societyId) {
      const fetchHouses = async () => {
        try {
          const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-houses/${societyId}`);
          setHouses(response.data.houses);
        } catch (error) {
          console.error('Error fetching houses:', error);
        }
      };
      fetchHouses();
    }
  }, [societyId]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filtered houses based on search query
  const filteredHouses = houses.filter((house) =>
    house.houseNo.toLowerCase().includes(search.toLowerCase()) ||
    house.blockNo.toLowerCase().includes(search.toLowerCase()) ||
    house.status.toLowerCase().includes(search.toLowerCase())
  );

  // Navigate to Add House page
  const handleAddHouse = () => {
    navigate('/add-house');
  };

  // Navigate to Edit House page
  const handleEditHouse = (id) => {
    navigate(`/edit-house/${id}`);
  };
 // Navigate to Edit House page
 const handleHouseInfo = (id) => {
  navigate(`/house-info/${id}`);
};
  // Show delete confirmation modal
  const handleDeleteClick = (id) => {
    setHouseToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm deletion
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app/api/delete-house`, {
        data: { id: houseToDelete, societyId }
      });
      setHouses(houses.filter((house) => house.id !== houseToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setHouseToDelete(null);
  };

  return (
    <div className={styles.housePageContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.houseTableSection}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <button className={styles.addButton} onClick={handleAddHouse}>Add +</button>
          <input
            type="text"
            className={styles.searchBar}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search House No., Block, Owner, Status..."
          />
        </div>

        {/* Table Section */}
        <table className={styles.houseTable}>
          <thead>
            <tr>
              <th>House No.</th>
              <th>Block No.</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouses.map((house) => (
              <tr key={house.id}>
                <td>{house.houseNo}</td>
                <td>{house.blockNo}</td>
                <td>{house.status}</td>
                <td>
                <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleHouseInfo(house.id)}>
                    <FaEye />
                  </button>
                  <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleEditHouse(house.id)}>
                    <FaEdit />
                  </button>
                  <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDeleteClick(house.id)}>
                    <FaTrash />
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.deleteModal}>
            <h3>Are you sure you want to delete this house?</h3>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={handleDeleteConfirmation}>Yes</button>
              <button className={styles.cancelButton} onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseList;
