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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDropdownModalOpen, setIsDropdownModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Ensure only logged-in users can access protected routes
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      toast.error('Please log in to access this page.');
      navigate('/'); // Redirect to login
      return;
    }
    setLocalProfile(userData);
    setFormData(userData);
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.role) {
      toast.error('All fields are required');
      return;
    }
    try {
      const response = await axios.put('https://api-kpur6ixuza-uc.a.run.app/update-admin', { 
        ...formData, 
        id: localProfile.id 
      });

      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setLocalProfile(formData);
        setIsEditing(false);
        setIsProfileModalOpen(false);
        setProfileFromProps(formData);
      }
    } catch (error) {
      toast.error('Error updating profile: ' + (error.response?.data?.error || error.message));
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    try {
      const confirm = window.confirm('Are you sure you want to delete your profile?');
      if (!confirm) return;
      await axios.delete('https://api-kpur6ixuza-uc.a.run.app/delete-profile', { data: { id: localProfile.id } });
      toast.success('Profile deleted successfully!');
      localStorage.removeItem('user');
      navigate('/'); // Redirect to login
    } catch (error) {
      toast.error('Error deleting profile: ' + error.message);
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/'); // Redirect to login
  };

  return (
    <div className="navbar">
      {/* Dashboard Title */}
      <div className="navbar-content">
        <h1 className="navbar-title">{moduleTitle || 'Dashboard'}</h1>
      </div>

      {/* User Profile Icon */}
      <FaUserCircle className="admin-icon" onClick={() => setIsDropdownModalOpen(true)} size={40} />

      {/* Dropdown Modal */}
      <Modal open={isDropdownModalOpen} onClose={() => setIsDropdownModalOpen(false)}>
        <Box className="dropdown-modal-box">
          <h2 className="modal-title">Options</h2>
          <div className="modal-actions">
            <button onClick={() => { setIsDropdownModalOpen(false); setIsProfileModalOpen(true); }} className="dropdown-item">Profile</button>
            <button onClick={handleLogout} className="dropdown-item">Logout</button>
            <button onClick={() => setIsDropdownModalOpen(false)} className="dropdown-item">Close</button>
          </div>
        </Box>
      </Modal>

      {/* Profile Modal */}
      <Modal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
        <Box className="modal-box">
          <h2 className="modal-title">Profile Details</h2>
          <div className="modal-content">
            <div className="modal-item"><strong>Email:</strong> {localProfile.email}</div>
            <div className="modal-item"><strong>Phone:</strong> {localProfile.phone}</div>
            <div className="modal-item"><strong>Role:</strong> {localProfile.role}</div>
            <div className="modal-actions">
              <button onClick={() => setIsEditing(true)} ><FaEdit /> Edit Profile</button>
              <button onClick={handleDeleteProfile} ><FaTrash /> Delete Profile</button>
              <button onClick={() => setIsProfileModalOpen(false)} >Close</button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal open={isEditing} onClose={() => setIsEditing(false)}>
        <Box className="modal-box">
          <h2 className="modal-title">Edit Profile</h2>
          <form className="edit-form" onSubmit={handleUpdateProfile}>
            <div className="input-wrapper">
              <label>Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
            </div>
            <div className="input-wrapper">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} required />
            </div>
            <div className="input-wrapper">
              <label>Role</label>
              <input type="text" name="role" value={formData.role || ''} disabled />
            </div>
            <div className="actions">
              <button type="submit" className="save-button">Save Changes</button>
              <button onClick={() => setIsEditing(false)} >Cancel</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Navbar;
