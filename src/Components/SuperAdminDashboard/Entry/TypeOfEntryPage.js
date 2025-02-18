import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import styles from './TypeOfEntryPage.module.css';
import { FaTrash, FaCheckCircle, FaEdit } from 'react-icons/fa';

const TypeOfEntryPage = () => {
  const [moduleTitle, setModuleTitle] = useState('Type of Entries');
  const [entries, setEntries] = useState([]); 
  const [societyEntries, setSocietyEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]); 
  const [entryFilter, setEntryFilter] = useState('all');
  const [modalSearch, setModalSearch] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [societyId, setSocietyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };

  // Fetch user role and society ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
      setSocietyId(userData.societyId || null);
    }
  }, []);

  // Fetch global entries (SuperAdmin)
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-type-of-entries');
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
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app
/api/delete-type-of-entry/${entryToDelete}`);
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

  // Fetch society-specific entries
  useEffect(() => {
    if (userRole !== 'superadmin' && societyId) {
      const fetchSocietyEntries = async () => {
        try {
          const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/society/get-entries/${societyId}`);
          setSocietyEntries(response.data.entries);
        } catch (error) {
          console.error('Error fetching society entries: ', error);
        }
      };

      fetchSocietyEntries();
    }
  }, [userRole, societyId]);

  const handleSearchChangesociety = (e) => {
    setSearch(e.target.value);
  };

  // Open modal to select entries
  const handleAddClick = () => {
    setShowAddModal(true);
    setErrorMessage(''); // Reset error message when opening modal
  };

  // Select/Deselect entries in the modal with validation
  const toggleSelectEntry = (entry) => {
    if (societyEntries.some(e => e.entryId === entry.id)) {
      setErrorMessage(`"${entry.title}" is already added to your society.`);
      return;
    }

    setErrorMessage('');
    setSelectedEntries(prevEntries =>
      prevEntries.some(e => e.id === entry.id)
        ? prevEntries.filter(e => e.id !== entry.id)
        : [...prevEntries, entry]
    );
  };

  // Submit selected entries
  const handleSubmitEntries = async () => {
    try {
      await Promise.all(
        selectedEntries.map(entry =>
          axios.post('https://api-kpur6ixuza-uc.a.run.app
/api/society/add-entry', {
            entryId: entry.id,
            societyId: societyId,
            userId: JSON.parse(localStorage.getItem('user')).id
          })
        )
      );

      setSocietyEntries([...societyEntries, ...selectedEntries]);
      setShowAddModal(false);
      setSelectedEntries([]); // Reset selection
    } catch (error) {
      console.error('Error adding entries to society:', error);
    }
  };

  // Delete an entry from the society
  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete('https://api-kpur6ixuza-uc.a.run.app
/api/society/delete-entry', {
        data: { entryId, societyId }
      });

      setSocietyEntries(societyEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  // Filter Entries for Modal
  const filteredEntriessociety = entries.filter(entry => 
    (entryFilter === 'all' || entry.entryType === entryFilter) &&
    entry.title.toLowerCase().includes(modalSearch.toLowerCase())
  );

  return (
    <div className={styles.entryPageContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
  
      {/* SuperAdmin UI */}
      {userRole === 'superadmin' && (
        <>
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
                      <img src={entry.logo || "/path/to/default-image.jpg"} alt={entry.title} className={styles.entryLogo} />
                    </td>
                    <td>{entry.title}</td>
                    <td>{entry.entryType}</td>
                    <td>
                      <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleEditClick(entry.id)}>
                        <FaEdit />
                      </button>
                      <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDeleteClick(entry.id)}>
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
        </>
      )}
  
      {/* Society User UI */}
      {userRole !== 'superadmin' && (
        <>
          <div className={styles.entriesTableSection}>
            <div className={styles.entriesHeader}>
              <button className={styles.addButton} onClick={handleAddClick}>
                Add +
              </button>
              <input
                type="text"
                className={styles.searchBar}
                value={search}
                onChange={handleSearchChangesociety}
                placeholder="Search by Entry or Type"
              />
            </div>
  
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
                {societyEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td><img src={entry.logo || "/path/to/default-image.jpg"} alt={entry.title} className={styles.entryLogo} /></td>
                    <td>{entry.title}</td>
                    <td>{entry.entryType}</td>
                    <td>
                      <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDeleteEntry(entry.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Add Entry Modal */}
          {showAddModal && (
            <div className={styles.modalBackdrop}>
              <div className={styles.addModal}>
                <h3>Select Entries to Add</h3>
                <div className={styles.filterSection}>
                  <select onChange={(e) => setEntryFilter(e.target.value)} value={entryFilter}>
                    <option value="all">All Entries</option>
                    <option value="regular">Regular</option>
                    <option value="occasional">Occasional</option>
                  </select>
                  <input
                    type="text"
                    className={styles.modalSearch}
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Search entries..."
                  />
                </div>
  
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
  
                {/* Entries Grid */}
                <div className={styles.entrySelectionGrid}>
                  {filteredEntriessociety.map(entry => (
                    <div
                      key={entry.id}
                      className={`${styles.entrySelectCard} ${selectedEntries.some(e => e.id === entry.id) ? styles.selected : ''}`}
                      onClick={() => toggleSelectEntry(entry)}
                    >
                      <img src={entry.logo || "/path/to/default-image.jpg"} alt={entry.title} className={styles.entryLogo} />
                      <p>{entry.title}</p>
                      {selectedEntries.some(e => e.id === entry.id) && <FaCheckCircle className={styles.selectedIcon} />}
                    </div>
                  ))}
                </div>
  
                {/* Submit & Close Buttons */}
                <button className={styles.submitButton} onClick={handleSubmitEntries}>Submit Selected Entries</button>
                <button className={styles.closeModalButton} onClick={() => setShowAddModal(false)}>Close</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default TypeOfEntryPage;
 