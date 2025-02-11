import React, { useState } from 'react';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import axios from 'axios';
import styles from './AddRole.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {
  const [moduleTitle, setModuleTitle] = useState('Add Role');
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleType, setRoleType] = useState('');
  const navigate = useNavigate();

  // Default permissions for SaaS role
  const saasPermissions = {
    society: { view: false, create: false, edit: false, delete: false, show: false },
    entries: { view: false, create: false, edit: false, delete: false, show: false },
    purpose: { view: false, create: false, edit: false, delete: false, show: false },
    roles: { view: false, create: false, edit: false, delete: false, show: false },
    users: { view: false, create: false, edit: false, delete: false, show: false }
  };

  // Default permissions for Society role
  const societyPermissions = {
    entries: { view: false, create: false, edit: false, delete: false, show: false },
    guestEntriesRequest: { view: false, create: false, edit: false, delete: false, show: false },
    typeOfEntries: { view: false, create: false, edit: false, delete: false, show: false },
    purposeOfOccasional: { view: false, create: false, edit: false, delete: false, show: false },
    houseList: { view: false, create: false, edit: false, delete: false, show: false },
    roles: { view: false, create: false, edit: false, delete: false, show: false },
    users: { view: false, create: false, edit: false, delete: false, show: false },
    attendance: { read: false, show: false } // Attendance only has read and show
  };

  // State for managing permissions dynamically
  const [permissions, setPermissions] = useState({});

  // Handle input changes
  const handleRoleTitleChange = (e) => setRoleTitle(e.target.value);
  const handleRoleDescriptionChange = (e) => setRoleDescription(e.target.value);

  // Handle role type change and reset permissions
  const handleRoleTypeChange = (type) => {
    setRoleType(type);
    setPermissions(type === 'saas' ? saasPermissions : societyPermissions);
  };

  // Handle permission checkbox toggles
  const handlePermissionChange = (module, action) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [module]: {
        ...prevPermissions[module],
        [action]: !prevPermissions[module][action], // Toggle value
      },
    }));
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!roleType) {
      toast.error("Please select a role type.");
      return;
    }
  
    const roleData = {
      title: roleTitle,
      description: roleDescription,
      roleType,
      permissions, 
    };
  
    console.log("Final roleData sent to API:", roleData); // Debugging log
  
    try {
      const response = await axios.post("https://api-kpur6ixuza-uc.a.run.app/api/add-role", roleData);
      console.log("API Response:", response.data);
      toast.success("Role added successfully!");
      navigate("/roles");
    } catch (error) {
      console.error("Error adding role:", error.response ? error.response.data : error);
      toast.error("Error adding role.");
    }
  };
  

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
                        {Object.keys(permissions[module]).map((action) => (
                          <div key={action} className={styles.permissionItem}>
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
          )}

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
