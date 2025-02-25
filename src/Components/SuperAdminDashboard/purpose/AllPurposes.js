import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import styles from './AllPurposes.module.css';
import { FaTrash, FaCheckCircle, FaEdit } from 'react-icons/fa';

const AllPurposes = () => {
  const [moduleTitle, setModuleTitle] = useState('Purpose of Occasional');
  const [societyPurposes, setSocietyPurposes] = useState([]);
  const [allPurposes, setAllPurposes] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [modalSearch, setModalSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [societyId, setSocietyId] = useState(null);
  const [purposes, setPurposes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purposeToDelete, setPurposeToDelete] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
      setSocietyId(userData.societyId || null);
    }
  }, []);

  // Fetch all global purposes
  useEffect(() => {
    const fetchAllPurposes = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-purposes');
        console.log('Fetched all purposes:', response.data);
        setAllPurposes(response.data.purposes || []);
      } catch (error) {
        console.error('Error fetching all purposes:', error);
      }
    };
    fetchAllPurposes();
  }, []);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredPurposes = (societyId ? societyPurposes : allPurposes).filter((purpose) =>
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
  // Fetch society-specific purposes
  useEffect(() => {
    if (userRole !== 'superadmin' && societyId){
      const fetchSocietyPurposes = async () => {
        try {
          const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/society/get-purposes/${societyId}`);
          setSocietyPurposes(response.data.purposes);
        } catch (error) {
          console.error('Error fetching society purposes:', error);
        }
      };
      fetchSocietyPurposes();
    }
  }, [userRole,societyId]);

  // Search functionality
  const handleSearchChangeSociety = (e) => {
    setSearch(e.target.value);
  };
  // Apply sorting to purposes
  const sortedPurposes = [...societyPurposes].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.purpose.localeCompare(b.purpose);
    } else {
      return b.purpose.localeCompare(a.purpose);
    }
  });

  // Filtered purposes for table
  const filteredPurposessociety = sortedPurposes.filter((purpose) =>
    purpose.purpose.toLowerCase().includes(search.toLowerCase())
  );

  // Delete a purpose from society
  const handleDeletePurpose = async (purposeId) => {
    try {
      await axios.delete('https://api-kpur6ixuza-uc.a.run.app/api/society/delete-purpose', {
        data: { purposeId, societyId }, 
      });
  
      setSocietyPurposes(societyPurposes.filter((purpose) => purpose.id !== purposeId));
    } catch (error) {
      console.error('Error deleting purpose:', error);
    }
  };
  

  // Open Add Purpose Modal
  const handleAddClick = () => {
    setShowAddModal(true);
    setErrorMessage('');
  };

  // Toggle Purpose Selection in Modal
  const toggleSelectPurpose = (purpose) => {
    if (societyPurposes.some((p) => p.purposeId === purpose.id)) {
      setErrorMessage(`"${purpose.purpose}" is already added to your society.`);
      return;
    }

    setErrorMessage('');
    setSelectedPurposes((prevPurposes) =>
      prevPurposes.some((p) => p.id === purpose.id)
        ? prevPurposes.filter((p) => p.id !== purpose.id)
        : [...prevPurposes, purpose]
    );
  };

  // Submit Selected Purposes
  const handleSubmitPurposes = async () => {
    try {
      await Promise.all(
        selectedPurposes.map((purpose) =>
          axios.post('https://api-kpur6ixuza-uc.a.run.app/api/society/add-purpose', {
            purposeId: purpose.id,
            societyId: societyId,
            userId: JSON.parse(localStorage.getItem('user')).id,
          })
        )
      );

      setSocietyPurposes([...societyPurposes, ...selectedPurposes]);
      setShowAddModal(false);
      setSelectedPurposes([]);
    } catch (error) {
      console.error('Error adding purposes to society:', error);
    }
  };

  return (
    <div className={styles.purposePageContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />
      {/* superadmin ui */}
      {userRole === 'superadmin' && (
      <>
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
      )}</>
    )}
      {/* Society User UI */}
      {userRole !== 'superadmin' && (
<>
<div className={styles.purposeTableSection}>
        <div className={styles.entriesHeader}>
          <button className={styles.addButton} onClick={handleAddClick}>Add Purpose</button>
          <input
            type="text"
            className={styles.searchBar}
            value={search}
            onChange={handleSearchChangeSociety}
            placeholder="Search by Purpose"
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
            {filteredPurposessociety.map((purpose) => (
              <tr key={purpose.id}>
                <td><img src={purpose.icon || "/path/to/default-image.jpg"} alt={purpose.purpose} className={styles.entryLogo} /></td>
                <td>{purpose.purpose}</td>
                <td>{purpose.purposeType}</td>
                <td>
                  <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDeletePurpose(purpose.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Purpose Modal */}
      {showAddModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.addModal}>
            <h3>Select Purposes to Add</h3>
            <input
              type="text"
              className={styles.modalSearch}
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              placeholder="Search purposes..."
            />

            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <div className={styles.entrySelectionGrid}>
              {allPurposes.filter(purpose => purpose.purpose.toLowerCase().includes(modalSearch.toLowerCase())).map(purpose => (
                <div
                  key={purpose.id}
                  className={`${styles.entrySelectCard} ${selectedPurposes.some(p => p.id === purpose.id) ? styles.selected : ''}`}
                  onClick={() => toggleSelectPurpose(purpose)}
                >
                  <img src={purpose.icon || "/path/to/default-image.jpg"} alt={purpose.purpose} className={styles.entryLogo} />
                  <p>{purpose.purpose}</p>
                  {selectedPurposes.some(p => p.id === purpose.id) && <FaCheckCircle className={styles.selectedIcon} />}
                </div>
              ))}
            </div>

            <button className={styles.submitButton} onClick={handleSubmitPurposes}>Submit Selected</button>
            <button className={styles.closeModalButton} onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}</>
    )}
    </div>
  );
};

export default AllPurposes;
