import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios'; 
import styles from './AllRoles.module.css';

const AllRoles = () => {
    const [moduleTitle, setModuleTitle] = useState('Roles');
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    // Fetch all roles from the API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/get-all-roles');
                setRoles(response.data.roles);
            } catch (error) {
                console.error('Error fetching roles: ', error);
            }
        };

        fetchRoles();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredRoles = roles.filter(role =>
        role.title.toLowerCase().includes(search.toLowerCase()) ||
        role.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteClick = (roleId) => {
        setRoleToDelete(roleId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            await axios.delete(`http://localhost:5000
/api/delete-role/${roleToDelete}`);
            setRoles(roles.filter(role => role.id !== roleToDelete));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setRoleToDelete(null);
    };

    return (
        <div className={styles.entryPageContainer}>
            <Navbar moduleTitle={moduleTitle} />
            <Sidebar onClick={(title) => setModuleTitle(title)} />

            <div className={styles.entriesTableSection}>
                {/* Header Section */}
                <div className={styles.entriesHeader}>
                    <button className={styles.addButton} onClick={() => window.location.href = '/add-role'}>
                        Add +
                    </button>
                    <input
                        type="text"
                        className={styles.searchBar}
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search by Role Title or Description"
                    />
                </div>

                {/* Table */}
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
                                    <button className={`${styles.actionButton} ${styles.edit}`} onClick={() => window.location.href = `/edit-role/${role.id}`}>
                                        Edit
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.delete}`}
                                        onClick={() => handleDeleteClick(role.id)}
                                    >
                                        Delete
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
