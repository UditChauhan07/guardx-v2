import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../../SuperAdminDashboard/sidebar/Sidebar';
import styles from './Edit_House.module.css';

const EditHouse = () => {
  const [moduleTitle, setModuleTitle] = useState('Edit House');
  const { houseId } = useParams(); 
  const [houseNo, setHouseNo] = useState('');
  const [blockNo, setBlockNo] = useState('');

  const [status, setStatus] = useState('Not Approved');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!houseId) {
      console.error("House ID is undefined.");
      return; 
    }
  
    const fetchHouseDetails = async () => {
        try {
          console.log("Fetching details for house ID:", houseId);
          const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/get-house/${houseId}`);
          setHouseNo(response.data.house.houseNo);
          setBlockNo(response.data.house.blockNo);

          setStatus(response.data.house.status);
        } catch (error) {
          console.error('Error fetching house details:', error);
          setErrorMessage('Failed to fetch house details.');
        }
      };
  
    fetchHouseDetails();
  }, [houseId]); 
  

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!houseNo || !blockNo ) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app
/api/update-house/${houseId}`, {
        houseNo,
        blockNo,
        status,
      });

      navigate('/house-list'); 
    } catch (error) {
      console.error('Error updating house:', error);
      setErrorMessage('Error updating house. Please try again.');
    }
  };

  return (
    <div className={styles.editHousePage}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.editHouseContainer}>
        <h2>Edit House</h2>
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
            <button type="submit" className={styles.submitButton}>Update House</button>
            <button type="button" className={styles.cancelButton} onClick={() => navigate('/house-list')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHouse;
