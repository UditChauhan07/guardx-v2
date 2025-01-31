import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = ({ setProfile: setProfileFromProps, moduleTitle }) => {
  const [localProfile, setLocalProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);  // For profile modal
  const [isEditing, setIsEditing] = useState(false);  // For edit profile modal
  const navigate = useNavigate();
  useEffect(() => {
    // Close the dropdown if clicked outside
    const handleClickOutside = (event) => {
      const dropdownMenu = document.querySelector('.dropdown-menu');
      const adminIcon = document.querySelector('.admin-icon');
      if (dropdownMenu && !dropdownMenu.contains(event.target) && !adminIcon.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  // Fetch user data on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }
    setLocalProfile(userData);
    setFormData(userData);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/update-admin', { ...formData, uid: localProfile.uid });
      toast.success('Profile updated successfully!');
      setLocalProfile(formData);
      setIsEditing(false);
      setIsProfileModalOpen(false);
      setProfileFromProps(formData);
    } catch (error) {
      console.log('Error updating profile: ', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const confirm = window.confirm('Are you sure you want to delete your profile?');
      if (!confirm) return;
      await axios.delete('http://localhost:5000/delete-admin', { data: { uid: localProfile.uid } });
      toast.success('Profile deleted successfully!');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      toast.error('Error deleting profile: ', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleOpenProfileModal = () => setIsProfileModalOpen(true);
  const handleCloseProfileModal = () => setIsProfileModalOpen(false);

  const handleOpenEditModal = () => {
    setIsEditing(true);
    setIsProfileModalOpen(false);  // Close profile modal
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
    setIsProfileModalOpen(true);  // Reopen profile modal
  };

  return (
    <div className="navbar">
      {/* Admin Logo and Dashboard Title */}
      <div className="navbar-content">
        <h1 className="navbar-title">{moduleTitle || 'Dashboard'}</h1>
      </div>

      {/* Dropdown for Profile */}
      <div className="dropdown">
        <FaUserCircle className="admin-icon" onClick={toggleDropdown} size={40} />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleOpenProfileModal} className="dropdown-item">Profile</button>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <Modal open={isProfileModalOpen} onClose={handleCloseProfileModal}>
        <Box className="modal-box">
          <h2 className="modal-title">Profile Details</h2>
          <div className="modal-content">
            <div className="modal-item">
              <strong>Email:</strong> {localProfile.email}
            </div>
            <div className="modal-item">
              <strong>Phone:</strong> {localProfile.phone}
            </div>
            <div className="modal-item">
              <strong>Role:</strong> {localProfile.role}
            </div>
            <div className="modal-actions">
              <button onClick={handleOpenEditModal} className="edit-button">
                <FaEdit /> Edit Profile
              </button>
              <button onClick={handleDeleteProfile} className="delete-button">
                <FaTrash /> Delete Profile
              </button>
              <button onClick={handleCloseProfileModal} className="cancel-button">Close</button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal open={isEditing} onClose={handleCloseEditModal}>
        <Box className="modal-box">
          <h2 className="modal-title">Edit Profile</h2>
          <form className="edit-form" onSubmit={handleUpdateProfile}>
            <div className="input-wrapper">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-wrapper">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-wrapper">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={formData.role || ''}
                disabled
              />
            </div>
            <div className="actions">
              <button type="submit" className="save-button">Save Changes</button>
              <button onClick={handleCloseEditModal} className="cancel-button">Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Navbar;
