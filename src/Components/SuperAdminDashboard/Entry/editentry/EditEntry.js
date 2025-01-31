import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import styles from './EditEntry.module.css';

const EditEntry = () => {
  const { id } = useParams();
  const [moduleTitle, setModuleTitle] = useState('Edit Entry');
  const [title, setTitle] = useState('');
  const [entryType, setEntryType] = useState('regular');
  const [logo, setLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-type-of-entry/${id}`);
        const entryData = response.data.entry;
        setTitle(entryData.title);
        setEntryType(entryData.entryType);
        setExistingLogo(entryData.logo); // Set the existing logo path
      } catch (error) {
        console.error('Error fetching entry: ', error);
      }
    };

    fetchEntry();
  }, [id]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleEntryTypeChange = (e) => setEntryType(e.target.value);
  const handleLogoChange = (e) => setLogo(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('entryType', entryType);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      await axios.put(`http://localhost:5000/api/update-type-of-entry/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      navigate('/type-of-entries');
    } catch (error) {
      setLoading(false);
      console.error('Error updating entry: ', error);
    }
  };

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };

  const handleBackButton = () => {
    navigate('/type-of-entries');
  };

  return (
    <div className={styles.editEntry}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
      <div className={styles.editEntryPageContainer}>
        <button onClick={handleBackButton} className={styles.backButton}>← Back to Entries</button>
        <h2 className={styles.pageTitle}>Edit Entry</h2>
        <form className={styles.editEntryForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label htmlFor="title">Entry Name</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              required
              placeholder="Enter Entry Name"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="logo">Update Icon</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
            />
            {existingLogo && (
              <div className={styles.existingLogo}>
                <img 
                  src={`http://localhost:5000${existingLogo}`} // Make sure it is prefixed with your server URL
                  alt="Existing Icon" 
                  className={styles.existingLogoImg} 
                />
              </div>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="entryType">Entry Type</label>
            <select
              id="entryType"
              name="entryType"
              value={entryType}
              onChange={handleEntryTypeChange}
              required
            >
              <option value="regular">Regular</option>
              <option value="occasional">Occasional</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Update Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEntry;
