import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import styles from './AllRoles.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AllRoles = () => {
  const [moduleTitle, setModuleTitle] = useState('Roles');
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const navigate = useNavigate();

  // ✅ Load user data from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const { role, societyId, permissions } = loggedInUser || {};

  // ✅ Check Permissions (Defaults to NO PERMISSIONS)
  const hasPermissions = permissions?.roles !== undefined;
  const canCreate = hasPermissions && permissions.roles.create;
  const canEdit = hasPermissions && permissions.roles.edit;
  const canDelete = hasPermissions && permissions.roles.delete;

  // ✅ Fetch Roles Based on Role & Society ID
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        let response;
        if (role === 'superadmin') {
          // ✅ Super Admin → Fetch All Roles
          response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/get-all-roles');
        } else if (societyId) {
          // ✅ Other Users → Fetch Society Roles
          response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-all-society-roles/${societyId}`);
        }

        if (response) {
          setRoles(response.data.roles);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Error fetching roles.');
      }
    };

    fetchRoles();
  }, [role, societyId]);

  // ✅ Handle Search Input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // ✅ Filter Roles by Search Term
  const filteredRoles = roles.filter(role =>
    role.title.toLowerCase().includes(search.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(search.toLowerCase()))
  );

  // ✅ Handle Delete Click
  const handleDeleteClick = (roleId) => {
    setRoleToDelete(roleId);
    setShowDeleteModal(true);
  };

  // ✅ Handle Delete Confirmation
  const handleDeleteConfirmation = async () => {
    try {
      const endpoint = role === 'superadmin'
        ? `https://api-kpur6ixuza-uc.a.run.app/api/delete-role/${roleToDelete}`
        : `https://api-kpur6ixuza-uc.a.run.app/api/delete-society-role/${roleToDelete}`;

      await axios.delete(endpoint);
      setRoles(roles.filter(role => role.id !== roleToDelete));
      setShowDeleteModal(false);
      toast.success('✅ Role deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting role:', error);
      toast.error('❌ Error deleting role.');
    }
  };

  // ✅ Handle Cancel Delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  return (
    <div className={styles.entryPageContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.entriesTableSection}>
        {/* ✅ Header Section */}
        <div className={styles.entriesHeader}>
          {/* ✅ Show "Add Role" Button If User Has Create Permission */}
          {canCreate && (
            <button className={styles.addButton} onClick={() => navigate('/add-role')}>
              Add +
            </button>
          )}
          <input
            type="text"
            className={styles.searchBar}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Role Title or Description"
          />
        </div>

        {/* ✅ Roles Table */}
        <table className={styles.entriesTable}>
          <thead>
            <tr>
              <th>Role Title</th>
              <th>Role Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id}>
                <td>{role.title}</td>
                <td>{role.description}</td>
                <td>
                  {/* ✅ Show Edit Button If User Has Edit Permission */}
                  {canEdit && (
                    <button
                      className={`${styles.actionButton} ${styles.edit}`}
                      onClick={() => navigate(`/edit-role/${role.id}`)}
                    >
                      <FaEdit />
                    </button>
                  )}
                  {/* ✅ Show Delete Button If User Has Delete Permission */}
                  {canDelete && (
                    <button
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => handleDeleteClick(role.id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Show Message if No Permissions */}
        {!hasPermissions && role !== 'superadmin' && (
          <div className={styles.noAccessMessage}>
            ❌ You do not have permission to manage roles.
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.deleteModal}>
            <h3>Are you sure you want to delete this role?</h3>
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

export default AllRoles;
