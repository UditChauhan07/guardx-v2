import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import styles from './EditPurpose.module.css';

const EditPurpose = () => {
  const { id } = useParams();
  const [moduleTitle, setModuleTitle] = useState('Edit Purpose');
  const [purpose, setPurpose] = useState('');
  const [purposeType, setPurposeType] = useState('occasional');
  const [icon, setIcon] = useState(null);
  const [existingIcon, setExistingIcon] = useState('');  // For storing the existing icon URL
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurpose = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-purpose/${id}`);
        const purposeData = response.data.purpose;
        setPurpose(purposeData.purpose);
        setPurposeType(purposeData.purposeType);
        setExistingIcon(purposeData.icon); // Set the existing icon
      } catch (error) {
        console.error('Error fetching purpose data: ', error);
      }
    };

    fetchPurpose();
  }, [id]);

  const handlePurposeChange = (e) => setPurpose(e.target.value);
  const handlePurposeTypeChange = (e) => setPurposeType(e.target.value);
  const handleIconChange = (e) => setIcon(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append('purpose', purpose);
    formData.append('purposeType', purposeType);
    if (icon) {
      formData.append('icon', icon); // Append the new icon if provided
    }
  
    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app/api/update-purpose/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      navigate('/purpose'); // Navigate after update
    } catch (error) {
      setLoading(false);
      console.error('Error updating purpose: ', error);
    }
  };
  

  return (
    <div className={styles.EditPurpose}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.EditPurposePageContainer}>
        <button onClick={() => navigate('/purpose')} className={styles.backButton}>← Back to Purposes</button>
        <h2 className={styles.pageTitle}>Edit Purpose</h2>
        <form className={styles.EditPurposeForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label htmlFor="purpose">Purpose</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={purpose}
              onChange={handlePurposeChange}
              required
              placeholder="Enter Purpose"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="purposeType">Purpose Type</label>
            <select
              id="purposeType"
              name="purposeType"
              value={purposeType}
              onChange={handlePurposeTypeChange}
              required
            >
              <option value="Courier">Courier</option>
              <option value="Doctor">Doctor</option>
              <option value="Friends">Friends</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Food">Food</option>
              <option value="Reletives">Reletives</option>
              <option value="LPG">LPG</option>
              <option value="Broker">Broker</option>
              <option value="Packers">Packers</option>
              <option value="Construction">Construction</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="icon">Purpose Icon</label>
            <input
              type="file"
              id="icon"
              name="icon"
              accept="image/*"
              onChange={handleIconChange}
            />
            {existingIcon && (
  <div className={styles.existingLogo}>
    <img 
      src={`https://api-kpur6ixuza-uc.a.run.app${existingIcon}`} 
      alt="Existing Icon" 
      className={styles.existingLogoImg} 
    />
  </div>
)}

          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Update Purpose'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPurpose;
