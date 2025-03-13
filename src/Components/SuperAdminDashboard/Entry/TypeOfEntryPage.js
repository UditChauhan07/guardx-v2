import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import styles from './TypeOfEntryPage.module.css';
import { FaTrash, FaCheckCircle, FaEdit, FaShareAlt, FaFileExport, FaChevronDown } from 'react-icons/fa';

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
  const [permissions, setPermissions] = useState({ create: false, edit: false, delete: false });
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };

 // Fetch user role, society ID, and permissions from localStorage
 useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    setUserRole(userData.role);
    setSocietyId(userData.societyId || null);
    setPermissions(userData.role === 'superadmin' ? { create: true, edit: true, delete: true } : userData.permissions?.entries || { create: false, edit: false, delete: false });
  }
}, []);
  // Fetch global entries (SuperAdmin)
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-type-of-entries');
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
          axios.post('https://api-kpur6ixuza-uc.a.run.app/api/society/add-entry', {
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
      await axios.delete('https://api-kpur6ixuza-uc.a.run.app/api/society/delete-entry', {
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
  const handleExport = async (format) => {
    try {
        const url = userRole === 'superadmin'
            ? `https://api-kpur6ixuza-uc.a.run.app
/api/export-all-type-entries?format=${format}`
            : `https://api-kpur6ixuza-uc.a.run.app
/api/export-all-society-entries/${societyId}?format=${format}`;

        console.log(`Sending export request to: ${url}`);
        const response = await axios.get(url, { responseType: 'blob' });

        if (response.status !== 200) {
            console.error("Unexpected response status:", response.status);
            return;
        }

        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `entries.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("File downloaded successfully.");
    } catch (error) {
        console.error("❌ Error exporting file:", error);
        alert("Error exporting file. Please try again.");
    }
};


  return (
    <div className={styles.entryPageContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
  
      {/* SuperAdmin UI */}
      {(userRole === 'superadmin' || societyId === null) && (
        <>
          <div className={styles.entriesTableSection}>
            {/* Header Section */}
            <div className={styles.entriesHeader}>
              <button className={styles.addButton}  disabled={!permissions.create} onClick={() => navigate('/add-entry')}>
                Add +
              </button>
              <div className={styles.exportDropdownContainer}>
            <button className={styles.exportButton} onClick={() => setShowExportDropdown(!showExportDropdown)}>
              <FaShareAlt /> Export <FaChevronDown />
            </button>
            {showExportDropdown && (
              <div className={styles.exportDropdown}>
                <button onClick={() => handleExport('xlsx')}><FaFileExport /> Excel</button>
                <button onClick={() => handleExport('csv')}><FaFileExport /> CSV</button>
              </div>
            )}
          </div>
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
                    <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleEditClick(entry.id)} disabled={!permissions.edit}>
                      <FaEdit />
                    </button>
                    <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDeleteClick(entry.id)} disabled={!permissions.delete}>
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
      {userRole !== 'superadmin' && societyId !== null && (
        <>
          <div className={styles.entriesTableSection}>
            <div className={styles.entriesHeader}>
            <button className={styles.addButton} onClick={() => setShowAddModal(true)} disabled={!permissions.create}>
              Add +
            </button>
            <div className={styles.exportDropdownContainer}>
            <button className={styles.exportButton} onClick={() => setShowExportDropdown(!showExportDropdown)}>
              <FaShareAlt /> Export <FaChevronDown />
            </button>
            {showExportDropdown && (
              <div className={styles.exportDropdown}>
                <button onClick={() => handleExport('xlsx')}><FaFileExport /> Excel</button>
                <button onClick={() => handleExport('csv')}><FaFileExport /> CSV</button>
              </div>
            )}
          </div>
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
                    <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDeleteEntry(entry.id)} disabled={!permissions.delete}>
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
 