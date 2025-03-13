import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SocietyDetails.css';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const SocietyDetails = () => {
  const { id } = useParams();  
  const [society, setSociety] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTitle, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app


/api/get-society/${id}`);
        setSociety(response.data.society);
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    };
    fetchSociety();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app

/api/get-society-users/${id}`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching society users:', error);
      }
    };
    fetchUsers();
  }, [id]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-roles');
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {
      name,
      phone,
      email,
      password,
      roleTitle,
      societyId: id,
    };
    try {
      await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-user', userData);
      toast.success('User added successfully!');
      setUsers([...users, userData]);
      setLoading(false);
      window.location.reload()
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user.');
      setLoading(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app

/api/delete-user/${userToDelete}`);
      toast.success('User deleted successfully!');
      setUsers(users.filter(user => user.id !== userToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user.');
    }
  };

  if (!society) return <div>Loading...</div>

  return (
    <div className="society-details-container">
      <button className="back-button" onClick={() => navigate('/society')}>
        &lt; Back to Society List
      </button>
      <h2>Society Details</h2>
      <div className="details-container">
          <div className="detail-item">
            <strong>Society Name:</strong>
            <p>{society.societyName}</p>
          </div>

          <div className="detail-item">
            <strong>Address:</strong>
            <p>{society.address}</p>
          </div>

          <div className="detail-item">
            <strong>City:</strong>
            <p>{society.city}</p>
          </div>

          <div className="detail-item">
            <strong>State:</strong>
            <p>{society.state}</p>
          </div>

          <div className="detail-item">
            <strong>Contact No:</strong>
            <p>{society.contactNo}</p>
          </div>

          <div className="detail-item">
            <strong>Society Registration No:</strong>
            <p>{society.registrationNo}</p>
          </div>

          <div className="detail-item">
            <strong>Society Email:</strong>
            <p>{society.email}</p>
          </div>

          <div className="detail-item">
            <strong>No. of Houses:</strong>
            <p>{society.houses}</p>
          </div>

          <div className="detail-item">
            <strong>Status:</strong>
            <p>{society.status}</p>
          </div>
        </div>
        {/* Add User Form */}
        <div className="add-user-form-container">
          <h3>Add User to Society</h3>
          <form onSubmit={handleAddUserSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <select value={roleTitle} onChange={(e) => setRole(e.target.value)} required className="form-select">
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.title}>{role.title}</option>
              ))}
            </select>
            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </div>
      <div className="users-container">
        <h3>Users</h3>
        <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.status}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleDeleteClick(user.id)}><FaTrash/></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users found in this society</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <button onClick={handleDeleteConfirmation}>Yes</button>
            <button onClick={() => setShowDeleteModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocietyDetails;
