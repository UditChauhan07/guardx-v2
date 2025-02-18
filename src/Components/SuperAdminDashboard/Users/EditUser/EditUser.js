import React, { useState, useEffect } from 'react';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import axios from 'axios';
import styles from './EditUser.module.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { id } = useParams();  
  const [moduleTitle, setModuleTitle] = useState('Edit User');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTitle, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/get-user/${id}`);
        const userData = userResponse.data.user;
        setName(userData.name);
        setPhone(userData.phone);
        setEmail(userData.email);
        setRole(userData.role);
        const rolesResponse = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-roles');
        setRoles(rolesResponse.data.roles);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedUserData = {
      name,
      phone,
      email,
      password,
      roleTitle,
    };

    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app
/api/update-user/${id}`, updatedUserData);
      toast.success('User updated successfully!');
      navigate('/users');
    } catch (error) {
      setLoading(false);
      console.error('Error updating user:', error.response?.data || error.message);
      toast.error('Error updating user.');
    }
  };

  return (
    <div className={styles.EditUser}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />
      <div className={styles.editUserPageContainer}>
        <button className={styles.backButton} onClick={() => navigate('/users')}>
          ← Back to Users
        </button>
        <h2 className={styles.pageTitle}>Edit User</h2>
        <form className={styles.editUserForm} onSubmit={handleSubmit}>
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
              {roles.map((role) => (
                <option key={role.id} value={role.title}>{role.title}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Update User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
