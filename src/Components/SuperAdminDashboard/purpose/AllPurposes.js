import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import styles from './AllPurposes.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AllPurposes = () => {
  const [moduleTitle, setModuleTitle] = useState('Purpose of Occasional');
  const [purposes, setPurposes] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purposeToDelete, setPurposeToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch all purposes from the API
  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-purposes');
        setPurposes(response.data.purposes);
      } catch (error) {
        console.error('Error fetching purposes:', error);
      }
    };

    fetchPurposes();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredPurposes = purposes.filter((purpose) =>
    purpose.purpose.toLowerCase().includes(search.toLowerCase()) ||
    purpose.purposeType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = async (purposeId) => {
    setPurposeToDelete(purposeId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app/api/delete-purpose/${purposeToDelete}`);
      setPurposes(purposes.filter((purpose) => purpose.id !== purposeToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting purpose:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPurposeToDelete(null);
  };

  const handleEditClick = (id) => {
    navigate(`/edit-purpose/${id}`);
  };

  return (
    <div className={styles.purposePageContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.purposeTableSection}>
        <div className={styles.entriesHeader}>
          <button className={styles.addButton} onClick={() => navigate('/add-purpose')}>
            Add +
          </button>
          <input
            type="text"
            className={styles.searchBar}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Purpose or Type"
          />
        </div>

        <table className={styles.entriesTable}>
          <thead>
            <tr>
              <th>Purpose Icon</th>
              <th>Purpose</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurposes.map((purpose) => (
              <tr key={purpose.id}>
                <td>
                  {/* Correctly display Base64 images or Firebase Storage URLs */}
                  {purpose.icon ? (
                    purpose.icon.startsWith("data:image") || purpose.icon.startsWith("https://storage.googleapis.com") ? (
                      <img
                        src={purpose.icon}
                        alt={purpose.purpose}
                        className={styles.entryLogo}
                      />
                    ) : (
                      <img 
                        src="/path/to/default-image.jpg"
                        alt="Default Icon"
                        className={styles.entryLogo}
                      />
                    )
                  ) : (
                    <img 
                      src="/path/to/default-image.jpg"
                      alt="Default Icon"
                      className={styles.entryLogo}
                    />
                  )}
                </td>
                <td>{purpose.purpose}</td>
                <td>{purpose.purposeType}</td>
                <td>
                  <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleEditClick(purpose.id)}>
                    <FaEdit />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.delete}`}
                    onClick={() => handleDeleteClick(purpose.id)}
                  >
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
            <h3>Are you sure you want to delete this purpose?</h3>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={handleDeleteConfirmation}>
                Yes
              </button>
              <button className={styles.cancelButton} onClick={handleCancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPurposes;
