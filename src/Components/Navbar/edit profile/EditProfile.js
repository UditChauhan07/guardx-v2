import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfile.module.css';
import Navbar from '../Navbar';
import Sidebar from '../../SuperAdminDashboard/sidebar/Sidebar';

const EditProfile = () => {
  const [moduleTitle, setModuleTitle] = useState('Edit Profile');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!userData) {
      navigate('/'); // Redirect to home if the user is not logged in
    } else {
      setFormData({
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
      });
    }
  }, [navigate, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put('https://api-kpur6ixuza-uc.a.run.app/update-admin', { ...formData, uid: userData.uid });
      localStorage.setItem('user', JSON.stringify({ ...userData, ...formData }));
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      console.error('Error updating profile: ', error);
    }
  };

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };

  return (
    <div className={styles.editProfileContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />

      <div className={styles.editProfileContent}>
        <h2>Edit Profile</h2>
        <form className={styles.editProfileForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
