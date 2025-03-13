import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import './Navbar.css';
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from '@mui/material';

const Navbar = ({ setProfile: setProfileFromProps, moduleTitle }) => {
  const [localProfile, setLocalProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDropdownModalOpen, setIsDropdownModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loginTime, setLoginTime] = useState('');
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      let updateData = {
        email: localProfile.email, 
        phone: formData.phone,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      if (formData.email !== localProfile.email) {
        updateData.newEmail = formData.email; 
      }

      console.log('Updating profile:', updateData);

      const response = await axios.put('https://api-kpur6ixuza-uc.a.run.app/update-admin', updateData);

      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        const updatedProfile = { ...localProfile, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedProfile));

        setLocalProfile(updatedProfile);
        setIsEditing(false);
        setIsProfileModalOpen(false);
        setProfileFromProps(updatedProfile);
      }
    } catch (error) {
      console.log('Error updating profile: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete your profile?');
      if (!confirmDelete) return;

      await axios.delete('https://api-kpur6ixuza-uc.a.run.app/delete-admin', { data: { email: localProfile.email } });

      toast.success('Profile deleted successfully!');
      localStorage.removeItem('user');
      navigate('/'); // Redirect to login
    } catch (error) {
      toast.error('Error deleting profile: ' + error.message);
    }
  };
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setLoginTime(storedUser.loginTime);
    }
  }, []);
  const handleLogout = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const logoutTime = new Date().toISOString(); 
    if (storedUser.role === "superAdmin") {
      console.log("🔹 Super Admin detected. Logging out directly...");
      localStorage.setItem("logoutTime", logoutTime);
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    try {
      // 🔹 **Check if the user is in the Attendance API**
      const response = await axios.get(
        `https://api-kpur6ixuza-uc.a.run.app
/api/attendance/${storedUser.id}`
      );
  
      if (response.data) {
        await axios.post("https://api-kpur6ixuza-uc.a.run.app/api/attendance/logout", {
          userId: storedUser.id,
        });
  
        console.log("✅ Logout time recorded successfully in Attendance API!");
      } else {
        console.warn("⚠️ User is not in Attendance API, skipping logout recording.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("⚠️ User not found in Attendance API, skipping API call.");
      } else {
        console.error("🔥 Error checking/logout from Attendance API:", error);
      }
    }
    localStorage.setItem("logoutTime", logoutTime);
    localStorage.removeItem("user");
    navigate("/");
  };
  
  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">{moduleTitle || 'Dashboard'}</h1>
      </div>

      <FaUserCircle className="admin-icon" onClick={() => setIsDropdownModalOpen(true)} size={40} />

      {/* Dropdown Modal */}
      <Modal open={isDropdownModalOpen} onClose={() => setIsDropdownModalOpen(false)}>
      <Box className="dropdown-modal-box">
        {/* Close Button at Top Right */}
        <IconButton className="close-button" onClick={() => setIsDropdownModalOpen(false)}>
          <CloseIcon />
        </IconButton>

        <h2 className="modal-title">Options</h2>

        <div className="modal-actions">
          {localProfile.role === "superadmin" ? (
            <>
              <button
                onClick={() => {
                  setIsDropdownModalOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="dropdown-item"
              >
                Profile
              </button>
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </>
          ) : (
            <>
              <button className="dropdown-item" onClick={() => navigate("/user-attendance-history")}>
                Attendance
              </button>
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </>
          )}
        </div>
      </Box>
    </Modal>

      {/* Profile Modal */}
      <Modal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
      <Box className="profile-modal-box">
        {/* Close Button at Top Right */}
        <IconButton className="close-button" onClick={() => setIsProfileModalOpen(false)}>
          <CloseIcon />
        </IconButton>

        <h2 className="modal-title">Profile Details</h2>

        <div className="modal-content">
          <div className="modal-item"><strong>Email:</strong> {localProfile.email}</div>
          <div className="modal-item"><strong>Phone:</strong> {localProfile.phone}</div>
          <div className="modal-item"><strong>Role:</strong> {localProfile.role}</div>

          {localProfile.role === "superadmin" && (
            <div className="modal-actions">
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
              <button className="delete-button" onClick={handleDeleteProfile}>
                <FaTrash /> Delete Profile
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button className="close-modal-btn" onClick={() => setIsProfileModalOpen(false)}>Close</button>
      </Box>
    </Modal>

      {/* Edit Profile Modal */}
      <Modal open={isEditing} onClose={() => setIsEditing(false)}>
      <Box className="edit-profile-modal-box">
        {/* Close Button at Top Right */}
        <IconButton className="close-button" onClick={() => setIsEditing(false)}>
          <CloseIcon />
        </IconButton>

        <h2 className="modal-title">Edit Profile</h2>

        <form className="edit-form" onSubmit={handleUpdateProfile}>
          <div className="input-wrapper1">
            <label>Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
          </div>

          <div className="input-wrapper1">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} required />
          </div>

          <div className="input-wrapper1">
            <label>Password (Leave blank to keep current password)</label>
            <input type="password" name="password" value={formData.password || ''} onChange={handleInputChange} />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      </Box>
    </Modal>
    </div>
  );
};

export default Navbar;
