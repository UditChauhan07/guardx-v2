import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import styles from './AllUsers.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AllUsers = () => {
  const [moduleTitle, setModuleTitle] = useState('Users');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app
/api/get-all-users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter users by search term
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(search.toLowerCase()))
  );

  // Handle delete user
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app
/api/delete-user/${userToDelete}`);
      setUsers(users.filter(user => user.id !== userToDelete));
      setShowDeleteModal(false);
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user.');
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className={styles.AllUsers}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.usersTableSection}>
        {/* Header Section */}
        <div className={styles.entriesHeader}>
          <button className={styles.addButton} onClick={() => navigate('/add-user')}>
            Add +
          </button>
          <input
            type="text"
            className={styles.searchBar}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Email or Role"
          />
        </div>

        {/* Table */}
        <table className={styles.entriesTable}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Password</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.status}</td>
                <td>{user.role}</td>
                <td>
                  <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => handleEditClick(user.id)}>
                    <FaEdit />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.delete}`}
                    onClick={() => handleDeleteClick(user.id)}
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
            <h3>Are you sure you want to delete this user?</h3>
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
    </div>
  );
};

export default AllUsers;
