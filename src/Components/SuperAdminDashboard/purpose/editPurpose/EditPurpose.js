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
  const [existingIcon, setExistingIcon] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurpose = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-purpose/${id}`);
        const purposeData = response.data.purpose;
        setPurpose(purposeData.purpose);
        setPurposeType(purposeData.purposeType);
        setExistingIcon(purposeData.icon);
        setPreview(purposeData.icon); // Set preview to the existing icon
      } catch (error) {
        console.error('Error fetching purpose data: ', error);
      }
    };

    fetchPurpose();
  }, [id]);

  const handlePurposeChange = (e) => setPurpose(e.target.value);
  const handlePurposeTypeChange = (e) => setPurposeType(e.target.value);

  // Convert image to Base64
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIcon(reader.result); // Set Base64 image
        setPreview(reader.result); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const purposeData = {
      purpose,
      purposeType,
      icon: icon || existingIcon, // Use new icon if updated, otherwise keep the old one
    };

    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app/api/update-purpose/${id}`, purposeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);
      navigate('/purpose');
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
              <option value="Relatives">Relatives</option>
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
            {preview && (
              <div className={styles.existingLogo}>
                <img 
                  src={preview} 
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
