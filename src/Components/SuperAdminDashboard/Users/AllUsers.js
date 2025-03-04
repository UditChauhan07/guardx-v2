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

 // ✅ Load user data from localStorage
 const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
 const { role, societyId, permissions } = loggedInUser || {};

 // ✅ If SuperAdmin, Full Access
 const isSuperAdmin = role === 'superadmin';
 const hasPermissions = permissions?.users !== undefined;

 // ✅ Define Permissions Based on Role
 const canCreate = isSuperAdmin || (hasPermissions && permissions.users.create);
 const canEdit = isSuperAdmin || (hasPermissions && permissions.users.edit);
 const canDelete = isSuperAdmin || (hasPermissions && permissions.users.delete);



  // ✅ Fetch Users Based on Role & Society ID
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response;
          response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-users');
         if (societyId) {
          response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-society-users/${societyId}`);
        }

        if (response) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('❌ Error fetching users.');
      }
    };

    fetchUsers();
  }, [isSuperAdmin, societyId]);


  // ✅ Handle Search Input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // ✅ Filter Users by Search Term
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(search.toLowerCase()))
  );

  // ✅ Handle Delete Click
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // ✅ Handle Delete Confirmation
  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app/api/delete-user/${userToDelete}`);
      setUsers(users.filter(user => user.id !== userToDelete));
      setShowDeleteModal(false);
      toast.success('✅ User deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      toast.error('❌ Error deleting user.');
    }
  };

  // ✅ Handle Cancel Delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div className={styles.AllUsers}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.usersTableSection}>
        {/* ✅ Header Section */}
        <div className={styles.entriesHeader}>
          {/* ✅ Show "Add User" Button If User Has Create Permission */}
          {canCreate && (
            <button className={styles.addButton} onClick={() => navigate('/add-user')}>
              Add +
            </button>
          )}
          <input
            type="text"
            className={styles.searchBar}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Email or Role"
          />
        </div>

        {/* ✅ Users Table */}
        <table className={styles.entriesTable}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>Status</th>
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
                  {/* ✅ Show Edit Button If User Has Edit Permission */}
                    <button
                      className={`${styles.actionButton} ${styles.edit}`}
                      onClick={() => navigate(`/edit-user/${user.id}`)} disabled={!canEdit}
                    >
                      <FaEdit />
                    </button>
                  {/* ✅ Show Delete Button If User Has Delete Permission */}
                    <button
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => handleDeleteClick(user.id)} disabled={!canDelete}
                    >
                      <FaTrash />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Show Message if No Permissions */}
        {!hasPermissions && role !== 'superadmin' && (
          <div className={styles.noAccessMessage}>
            ❌ You do not have permission to manage users.
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
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
