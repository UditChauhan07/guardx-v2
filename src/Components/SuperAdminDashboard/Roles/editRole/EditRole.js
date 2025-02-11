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
  const [roleType, setRoleType] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Default permissions based on role type
  const saasPermissions = {
    society: { view: false, create: false, edit: false, delete: false, show: false },
    entries: { view: false, create: false, edit: false, delete: false, show: false },
    purpose: { view: false, create: false, edit: false, delete: false, show: false },
    roles: { view: false, create: false, edit: false, delete: false, show: false },
    users: { view: false, create: false, edit: false, delete: false, show: false }
  };

  const societyPermissions = {
    entries: { view: false, create: false, edit: false, delete: false, show: false },
    guestEntriesRequest: { view: false, create: false, edit: false, delete: false, show: false },
    typeOfEntries: { view: false, create: false, edit: false, delete: false, show: false },
    purposeOfOccasional: { view: false, create: false, edit: false, delete: false, show: false },
    houseList: { view: false, create: false, edit: false, delete: false, show: false },
    roles: { view: false, create: false, edit: false, delete: false, show: false },
    users: { view: false, create: false, edit: false, delete: false, show: false },
    attendance: { read: false, show: false } // Only read and show for attendance
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-role/${id}`);
        const roleData = response.data.role;

        setRoleTitle(roleData.title);
        setRoleDescription(roleData.description);
        setRoleType(roleData.roleType);

        // Merge existing permissions with default values
        const defaultPermissions = roleData.roleType === 'saas' ? saasPermissions : societyPermissions;
        const mergedPermissions = { ...defaultPermissions, ...roleData.permissions };

        setPermissions(mergedPermissions);
      } catch (error) {
        console.error('Error fetching role data: ', error);
      }
    };
    fetchRole();
  }, [id]);

  // Handle changes
  const handleRoleTitleChange = (e) => setRoleTitle(e.target.value);
  const handleRoleDescriptionChange = (e) => setRoleDescription(e.target.value);

  const handleRoleTypeChange = (type) => {
    setRoleType(type);
    setPermissions(type === 'saas' ? saasPermissions : societyPermissions);
  };

  const handlePermissionChange = (module, action, value) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [module]: {
        ...prevPermissions[module],
        [action]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!roleType) {
      alert("Please select a role type.");
      setLoading(false);
      return;
    }

    const updatedRoleData = {
      title: roleTitle,
      description: roleDescription,
      roleType,
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

  return (
    <div className={styles.editRolePage}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.editRoleContainer}>
        <button onClick={() => navigate('/roles')} className={styles.backButton}>← Back to Roles</button>
        <h2 className={styles.pageTitle}>Edit Role</h2>

        <form className={styles.editRoleForm} onSubmit={handleSubmit}>
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

          {/* Role Type Selection */}
          <div className={styles.inputWrapper}>
            <label>Role Type</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="roleType"
                  value="saas"
                  checked={roleType === 'saas'}
                  onChange={() => handleRoleTypeChange('saas')}
                />
                SaaS
              </label>
              <label>
                <input
                  type="radio"
                  name="roleType"
                  value="society"
                  checked={roleType === 'society'}
                  onChange={() => handleRoleTypeChange('society')}
                />
                Society
              </label>
            </div>
          </div>

          {/* Permissions Table */}
          {roleType && (
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
                        {Object.keys(permissions[module]).map((action) => (
                          <div key={action} className={styles.permissionItem}>
                            <label>
                              <input
                                type="checkbox"
                                checked={permissions[module][action]}
                                onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
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
          )}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Updating...' : 'Update Role'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRole;
