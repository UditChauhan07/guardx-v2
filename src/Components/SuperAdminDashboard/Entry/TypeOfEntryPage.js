import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import styles from './TypeOfEntryPage.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TypeOfEntryPage = () => {
  const [moduleTitle, setModuleTitle] = useState('Type of Entries');
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSidebarClick = (title) => {
    setModuleTitle(title);  
  };

  // Fetch the entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-all-type-of-entries');
        setEntries(response.data.entries);
      } catch (error) {
        console.error('Error fetching entries: ', error);
      }
    };

    fetchEntries();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(search.toLowerCase()) ||
    entry.entryType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (entryId) => {
    setEntryToDelete(entryId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-type-of-entry/${entryToDelete}`);
      setEntries(entries.filter(entry => entry.id !== entryToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit-entry/${id}`);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  return (
    <div className={styles.entryPageContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
      
      <div className={styles.entriesTableSection}>
        {/* Header Section */}
        <div className={styles.entriesHeader}>
          <button className={styles.addButton} onClick={() => navigate('/add-entry')}>
            Add +
          </button>
          <input
            type="text"
            className={styles.searchBar}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Entry or Type"
          />
        </div>
        
        {/* Table */}
        <table className={styles.entriesTable}>
          <thead>
            <tr>
              <th>Entry Logo</th>
              <th>Entry</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <img 
                    src={entry.logo ? `http://localhost:5000${entry.logo}` : '/path/to/default-image.jpg'} 
                    alt={entry.title} 
                    className={styles.entryLogo} 
                  />
                </td>
                <td>{entry.title}</td>
                <td>{entry.entryType}</td>
                <td>
                  <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleEditClick(entry.id)}>
                    <FaEdit />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.delete}`}
                    onClick={() => handleDeleteClick(entry.id)}
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
            <h3>Are you sure you want to delete this entry?</h3>
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

export default TypeOfEntryPage;
