import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Add_House.module.css';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../../SuperAdminDashboard/sidebar/Sidebar';

const AddHouse = () => {
  const [moduleTitle, setModuleTitle] = useState('Add House');
  const [houseNo, setHouseNo] = useState('');
  const [blockNo, setBlockNo] = useState('');
  const [status, setStatus] = useState('Not Approved');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch society ID from localStorage
  const storedUser = localStorage.getItem('user');
  const societyId = storedUser ? JSON.parse(storedUser).societyId : null;

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!houseNo || !blockNo ) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/add-house', {
        houseNo,
        blockNo,
        status,
        societyId,
      });

      navigate('/house-list'); 
    } catch (error) {
      console.error('Error adding house:', error);
      setErrorMessage('Error adding house. Please try again.');
    }
  };

  return (
    <div className={styles.addHousePage}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.addHouseContainer}>
        <h2>Add New House</h2>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} className={styles.houseForm}>
          <div className={styles.formGroup}>
            <label>House No.</label>
            <input
              type="text"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="Enter House Number"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Block No.</label>
            <input
              type="text"
              value={blockNo}
              onChange={(e) => setBlockNo(e.target.value)}
              placeholder="Enter Block Number"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Not Approved">Not Approved</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>Add House</button>
            <button type="button" className={styles.cancelButton} onClick={() => navigate('/house-list')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHouse;
