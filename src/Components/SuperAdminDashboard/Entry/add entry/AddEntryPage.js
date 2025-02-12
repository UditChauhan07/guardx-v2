import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AddEntryPage.module.css'; // Import CSS module
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';

const AddEntryPage = () => {
  const [title, setTitle] = useState('');
  const [entryType, setEntryType] = useState('occasional'); // Default entry type
  const [logoBase64, setLogoBase64] = useState(''); // Store Base64 image
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleEntryTypeChange = (e) => setEntryType(e.target.value);

  // Convert image to Base64
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setLogoBase64(reader.result.split(',')[1]); // Extract only Base64 part
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-type-of-entry', {
        title,
        entryType,
        logoBase64, // Sending Base64 image instead of file
      });

      setLoading(false);
      navigate('/type-of-entries'); // Redirect to the Type of Entries page after adding
    } catch (error) {
      setLoading(false);
      console.error('Error adding entry: ', error);
    }
  };

  const [moduleTitle, setModuleTitle] = useState('Add Entry');
  const handleSidebarClick = (title) => setModuleTitle(title);
  const handleBackButton = () => navigate('/type-of-entries'); // Navigate back

  return (
    <div className={styles.addEntry}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
      <div className={styles.addEntryPageContainer}>
        <form className={styles.addEntryForm} onSubmit={handleSubmit}>
          <button onClick={handleBackButton} className={styles.backButton}>
            ← Back to Entries
          </button>

          <div className={styles.inputWrapper}>
            <label htmlFor="title">Enter Entries</label>
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
            <label htmlFor="logo">Add Icon</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              required
            />
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
              <option value="occasional">Occasional</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Adding...' : 'Add Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEntryPage;
