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
  const [logoBase64, setLogoBase64] = useState(''); // Store Base64 logo
  const [existingLogo, setExistingLogo] = useState(''); // Store existing logo URL
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(
          `https://api-kpur6ixuza-uc.a.run.app
/api/get-type-of-entry/${id}`
        );
        const entryData = response.data.entry;
        setTitle(entryData.title);
        setEntryType(entryData.entryType);
        setExistingLogo(entryData.logo);
      } catch (error) {
        console.error('Error fetching entry: ', error);
      }
    };

    fetchEntry();
  }, [id]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleEntryTypeChange = (e) => setEntryType(e.target.value);

  // Convert new image to Base64
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setLogoBase64(reader.result); // Store full Base64 string
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app
/api/update-type-of-entry/${id}`, {
        title,
        entryType,
        logoBase64: logoBase64 || existingLogo, // Send Base64 or existing URL
      });

      setLoading(false);
      navigate('/type-of-entries'); // Redirect after update
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
        <button type="button" onClick={handleBackButton} className={styles.backButton}>
          ← Back to Entries
        </button>
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
            <input type="file" id="logo" name="logo" accept="image/*" onChange={handleLogoChange} />
            <div className={styles.imagePreview}>
              {logoBase64 ? (
                <img src={logoBase64} alt="New Icon Preview" className={styles.previewImg} />
              ) : (
                existingLogo && (
                  <img src={existingLogo} alt="Existing Icon" className={styles.previewImg} />
                )
              )}
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="entryType">Entry Type</label>
            <select id="entryType" name="entryType" value={entryType} onChange={handleEntryTypeChange} required>
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
