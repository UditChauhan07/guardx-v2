import React, { useState } from 'react';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import axios from 'axios'; // Make sure axios is imported
import styles from './AddRole.module.css'; // CSS module for styling
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {
  const [moduleTitle, setModuleTitle] = useState('Add Role');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [permissions, setPermissions] = useState({
    society: { view: false, create: false, edit: false, delete: false, show: false },
    entries: { view: false, create: false, edit: false, delete: false, show: false },
    purpose: { view: false, create: false, edit: false, delete: false, show: false },
    roles: { view: false, create: false, edit: false, delete: false, show: false },
    users: { view: false, create: false, edit: false, delete: false, show: false }
  });

  // Handle input change for role title and description
  const handleRoleTitleChange = (e) => setRoleTitle(e.target.value);
  const handleRoleDescriptionChange = (e) => setRoleDescription(e.target.value);

  // Handle checkbox changes for permissions
  const handlePermissionChange = (module, action) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [module]: {
        ...prevPermissions[module],
        [action]: !prevPermissions[module][action],
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roleData = {
      title: roleTitle,
      description: roleDescription,
      permissions,
    };

    try {
      // Make the API call to save the role
      await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-role', roleData);
      toast.success('Role added successfully!');
      navigate('/roles');
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Error adding role.');
    }
  };

  const navigate = useNavigate();

  return (
    <div className={styles.AddRole}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />
      <div className={styles.addRolePageContainer}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          ← Back to Roles
        </button>
        <h2 className={styles.pageTitle}>Add Role</h2>

        <form className={styles.addRoleForm} onSubmit={handleSubmit}>
          {/* Role Title */}
          <div className={styles.inputWrapper}>
            <label htmlFor="roleTitle">Role Title</label>
            <input
              type="text"
              id="roleTitle"
              name="roleTitle"
              value={roleTitle}
              onChange={handleRoleTitleChange}
              required
              placeholder="Enter Role Title"
            />
          </div>

          {/* Role Description */}
          <div className={styles.inputWrapper}>
            <label htmlFor="roleDescription">Role Description</label>
            <textarea
              id="roleDescription"
              name="roleDescription"
              value={roleDescription}
              onChange={handleRoleDescriptionChange}
              required
              placeholder="Enter Role Description"
            />
          </div>

          {/* Permissions */}
          <div className={styles.permissionsWrapper}>
            <h3>Permissions</h3>
            <table>
              <thead>
                <tr>
                  <th>Module Name</th>
                  <th>Module Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(permissions).map((module) => (
                  <tr key={module}>
                    <td>{module.charAt(0).toUpperCase() + module.slice(1)}</td>
                    <td>
                      {['view', 'create', 'edit', 'delete', 'show'].map((action) => (
                        <div key={`${module}-${action}`} className={styles.permissionItem}>
                          <label>
                            <input
                              type="checkbox"
                              checked={permissions[module][action]}
                              onChange={() => handlePermissionChange(module, action)}
                            />
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </label>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton}>
            Add Role
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRole;
