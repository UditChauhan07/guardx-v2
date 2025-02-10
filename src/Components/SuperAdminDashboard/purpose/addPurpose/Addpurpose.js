import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import styles from './AddPurpose.module.css'; // Apply the new CSS module

const AddPurpose = () => {
  const [moduleTitle, setModuleTitle] = useState('Add Purpose');
  const [purpose, setPurpose] = useState('');
  const [purposeType, setPurposeType] = useState('occasional');
  const [icon, setIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handlePurposeChange = (e) => setPurpose(e.target.value);
  const handlePurposeTypeChange = (e) => setPurposeType(e.target.value);
  const handleIconChange = (e) => setIcon(e.target.files[0]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('purpose', purpose);
    formData.append('purposeType', purposeType);
    if (icon) {
      formData.append('icon', icon);
    }

    try {
      await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-purpose', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      navigate('/purpose'); // Redirect after successfully adding purpose
    } catch (error) {
      setLoading(false);
      console.error('Error adding purpose: ', error);
    }
  };

  // Handle back button
  const handleBackButton = () => {
    navigate('/purpose'); // Navigate back to the purposes list
  };

  return (
    <div className={styles.addPurpose}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.addPurposePageContainer}>
        <button onClick={handleBackButton} className={styles.backButton}>← Back to Purposes</button>
        <h2 className={styles.pageTitle}>Add Purpose</h2>
        <form className={styles.addPurposeForm} onSubmit={handleSubmit}>
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
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Adding...' : 'Add Purpose'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPurpose;
