import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import styles from './EditRole.module.css';

const EditRole = () => {
  const { id } = useParams(); 
  const [moduleTitle, setModuleTitle] = useState('Edit Role');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [permissions, setPermissions] = useState({
    society: { view: false, create: false, edit: false, delete: false, show: false },
    entries: { view: false, create: false, edit: false, delete: false, show: false },
    purpose: { view: false, create: false, edit: false, delete: false, show: false },
    roles: { view: false, create: false, edit: false, delete: false, show: false },
    users: { view: false, create: false, edit: false, delete: false, show: false }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-role/${id}`);
        const roleData = response.data.role;
        setRoleTitle(roleData.title);
        setRoleDescription(roleData.description);
        setPermissions(roleData.permissions); 
      } catch (error) {
        console.error('Error fetching role data: ', error);
      }
    };

    fetchRole();
  }, [id]);

  // Handle input field changes
  const handleRoleTitleChange = (e) => setRoleTitle(e.target.value);
  const handleRoleDescriptionChange = (e) => setRoleDescription(e.target.value);

  const handlePermissionChange = (module, action, value) => {
    setPermissions({
      ...permissions,
      [module]: {
        ...permissions[module],
        [action]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedRoleData = {
      title: roleTitle,
      description: roleDescription,
      permissions,
    };

    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app/api/update-role/${id}`, updatedRoleData);
      setLoading(false);
      navigate('/roles'); 
    } catch (error) {
      setLoading(false);
      console.error('Error updating role: ', error);
    }
  };

  // Handle back button
  const handleBackButton = () => {
    navigate('/roles'); 
  };

  return (
    <div className={styles.editRolePage}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.editRoleContainer}>
        <button onClick={handleBackButton} className={styles.backButton}>← Back to Roles</button>
        <h2 className={styles.pageTitle}>Edit Role</h2>

        <form className={styles.editRoleForm} onSubmit={handleSubmit}>
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

          <div className={styles.permissionTable}>
            <h4>Permissions</h4>
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
                      {['create', 'view', 'edit', 'delete', 'show'].map((action) => (
                        <div key={action}>
                          <input
                            type="checkbox"
                            id={`${module}-${action}`}
                            checked={permissions[module][action]}
                            onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                          />
                          <label htmlFor={`${module}-${action}`}>{action.charAt(0).toUpperCase() + action.slice(1)}</label>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Update Role'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRole;
