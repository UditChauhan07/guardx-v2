import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './House_info.module.css';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../../SuperAdminDashboard/sidebar/Sidebar';
import { FaEdit, FaTrash } from 'react-icons/fa';

const House_Info = () => {
  const [moduleTitle, setModuleTitle] = useState('House Information');
  const { houseId } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState({});
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [adharNo, setAdharNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ownerImage, setOwnerImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ✅ Fetch House Details
  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        if (!houseId) {
          setError("House ID is missing.");
          return;
        }
        const houseResponse = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/get-house/${houseId}`);
        setHouse(houseResponse.data.house);
      } catch (error) {
        console.error("Error fetching house details:", error);
        setError("Failed to fetch house details.");
      }
    };
    fetchHouseDetails();
  }, [houseId]);

  // ✅ Fetch House Owner Details
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        const ownerResponse = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/get-house-owner/${houseId}`);
        if (ownerResponse.data.owner) {
          setOwner(ownerResponse.data.owner); 
          console.log("Fetched Owner:", ownerResponse.data.owner); // Debugging
        }
      } catch (error) {
        console.error("Error fetching owner details:", error);
        setOwner(null);
      }
    };
  
    fetchOwnerDetails();
  }, [houseId]);
  



  const openEditModal = () => {
    if (!owner || !owner.id) {
      setErrorMessage("Owner ID is missing.");
      return;
    }
  
    setOwnerName(owner.ownerName);
    setMobileNo(owner.mobileNo);
    setAdharNo(owner.adharNo);
    setEmail(owner.email);
    setPassword(""); // Keep password empty
    setOwnerImage(owner.ownerImage);
    
    setShowEditModal(true);
  };
  
    
  
  // ✅ Convert Image to Base64 (For Upload)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setOwnerImage(reader.result); // Base64 encoded image
      };
    }
  };

  // ✅ Handle Adding a New Owner
  const handleAddOwner = async (e) => {
    e.preventDefault();

    if (!houseId || !ownerName || !mobileNo || !adharNo || !email || !password || !ownerImage) {
      setErrorMessage('All fields are required!');
      return;
    }

    try {
      const response = await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-house-owner', {
        houseId,
        ownerName,
        mobileNo,
        adharNo,
        email,
        password,
        ownerImage, // Sending Base64 Image
      });

      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error adding owner:', error);
      setErrorMessage('Failed to add owner. Please check your input.');
    }
  };

  // ✅ Handle Editing Owner Details
  const handleEditOwner = async (e) => {
    e.preventDefault();
  
    if (!owner || !owner.id) {
      setErrorMessage("Owner ID is missing.");
      return;
    }
  
    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app
/api/update-house-owner/${owner.id}`, {
        ownerName,
        mobileNo,
        adharNo,
        email,
        password, 
        ownerImage
      });
  
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating owner:', error);
      setErrorMessage('Failed to update owner.');
    }
  };
  
  
  
  const handleDeleteOwner = async () => {
    if (!owner || !owner.id) {
      setErrorMessage("Owner ID is missing.");
      return;
    }
  
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app
/api/delete-house-owner/${owner.id}`);
      setOwner(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting owner:', error);
      setErrorMessage('Failed to delete owner.');
    }
  };
  
  
  

  return (
    <div className={styles.houseInfoContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      {/* Back Button */}
      <button className={styles.backButton} onClick={() => navigate(-1)}>🔙 Back</button>

      {/* House Details Card */}
      <div className={styles.houseCard}>
        <h2 className={styles.pageTitle}>🏠 House Details</h2>
        
        <div className={styles.infoItem}>
          <span className={styles.label}>House No:</span>
          <span className={styles.value}>{house.houseNo || 'N/A'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Block No:</span>
          <span className={styles.value}>{house.blockNo || 'N/A'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Status:</span>
          <span className={`${styles.value} ${house.status === 'Approved' ? styles.approved : styles.notApproved}`}>
            {house.status || 'N/A'}
          </span>
        </div>
      </div>

      {/* House Owner Details */}
      <div className={styles.ownerCard}>
        <h2 className={styles.pageTitle}>👤 House Owner Details</h2>

        {owner ? (
          <>

          <div className={styles.ownerImageContainer}>
              <img src={owner.ownerImage || "/default-avatar.png"} alt="Owner" className={styles.ownerImage} />
            </div>
          {/* Edit and Delete Buttons */}
          <div className={styles.actionButtons}>
              <button className={styles.editButton} onClick={openEditModal}>
  <FaEdit />
</button>

              <button className={styles.deleteButton} onClick={handleDeleteOwner}><FaTrash /></button>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Owner Name:</span>
              <span className={styles.value}>{owner.ownerName || 'N/A'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Mobile No:</span>
              <span className={styles.value}>{owner.mobileNo || 'N/A'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Aadhar No:</span>
              <span className={styles.value}>{owner.adharNo || 'N/A'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{owner.email || 'N/A'}</span>
            </div>
            
          </>
        ) : (
          <button className={styles.addOwnerButton} onClick={() => setShowModal(true)}>➕ Add Owner</button>
        )}
      </div>

      {/* Modal for Editing Owner */}
      {showEditModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContainer}>
            <h3>Edit House Owner</h3>
            <form onSubmit={handleEditOwner}>
              <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
              <input type="text" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
              <input type="text" value={adharNo} onChange={(e) => setAdharNo(e.target.value)} required />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <button type="submit">Update Owner</button>
              <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding Owner */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContainer}>
            <h3>Add House Owner Details</h3>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <form onSubmit={handleAddOwner}>
              <input type="text" placeholder="Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
              <input type="text" placeholder="Mobile No." value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
              <input type="text" placeholder="Adhar No." value={adharNo} onChange={(e) => setAdharNo(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

              {/* File Upload for Image */}
              <input type="file" accept="image/*" onChange={handleImageUpload} required />
              <button type="submit">Add Owner</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default House_Info;
