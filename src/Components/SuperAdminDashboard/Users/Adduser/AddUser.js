import React, { useState, useEffect } from 'react';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import axios from 'axios';
import styles from './AddUser.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [moduleTitle, setModuleTitle] = useState('Add User');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTitle, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get societyId from localStorage
  const societyId = JSON.parse(localStorage.getItem('user'))?.societyId || null;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        let response;
        if (societyId) {
          // Fetch society-specific roles
          response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-all-society-roles/${societyId}`);
        } else {
          // Fetch all roles
          response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-roles');
        }
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to fetch roles.');
      }
    };

    fetchRoles();
  }, [societyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      name,
      phone,
      email,
      password,
      roleTitle,
      societyId, // Always get societyId from localStorage
    };

    try {
      if (societyId) {
        // Add society user
        await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-society-user', userData);
      } else {
        // Add normal user
        await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-user', userData);
      }

      toast.success('User added successfully!');
      navigate('/users');
    } catch (error) {
      setLoading(false);
      console.error('Error adding user:', error.response?.data || error.message);
      toast.error('Error adding user.');
    }
  };

  return (
    <div className={styles.AddUser}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />
      <div className={styles.addUserPageContainer}>
        <button className={styles.backButton} onClick={() => navigate('/users')}>
          ← Back to Users
        </button>
        <h2 className={styles.pageTitle}>Add User</h2>
        <form className={styles.addUserForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="phone">Phone Number</label>
            <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="role">Role</label>
            <select id="role" value={roleTitle} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <option key={role.id} value={role.title}>{role.title}</option>
                ))
              ) : (
                <option disabled>No roles available</option>
              )}
            </select>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
