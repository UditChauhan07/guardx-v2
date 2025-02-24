import React, { useState, useEffect } from 'react';
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
  const [permissions, setPermissions] = useState({});
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    }
  }, []);

  // Default permissions for SaaS role (global roles)
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
    attendance: { read: false, show: false }
  };

  // Default permissions for Guard Access role (society-specific)
  const guardAccessPermissions = {
    guardAccess: { public: false }
  };

  // Handle input changes
  const handleRoleTitleChange = (e) => setRoleTitle(e.target.value);
  const handleRoleDescriptionChange = (e) => setRoleDescription(e.target.value);

  // Handle role type change and set default permissions based on user type
  const handleRoleTypeChange = (type) => {
    setRoleType(type);
    // If the user has a societyId, they can only create "society" or "guard access" roles.
    if (userData && userData.societyId) {
      setPermissions(type === 'guard access' ? guardAccessPermissions : societyPermissions);
    } else {
      // Otherwise, for superadmin or global users, allow SaaS roles.
      setPermissions(type === 'saas' ? saasPermissions : societyPermissions);
    }
  };

  // Handle permission checkbox toggles
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

    // If the user has a societyId, include it so that the role is created for that society
    if (userData && userData.societyId) {
      roleData.societyId = userData.societyId;
    }

    console.log("Final roleData sent to API:", roleData);

    try {
      // Choose the endpoint based on user type: superadmin uses the global role endpoint,
      // while society users use the society role endpoint.
      const endpoint = userData && userData.societyId
        ? "https://api-kpur6ixuza-uc.a.run.app/api/add-society-role"
        : "https://api-kpur6ixuza-uc.a.run.app/api/add-role";

      const response = await axios.post(endpoint, roleData);
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
              {userData && userData.societyId ? (
                // If the user belongs to a society, allow only Society and Guard Access roles
                <>
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
                  <label>
                    <input
                      type="radio"
                      name="roleType"
                      value="guard access"
                      checked={roleType === 'guard access'}
                      onChange={() => handleRoleTypeChange('guard access')}
                    />
                    Guard Access
                  </label>
                </>
              ) : (
                // Otherwise, for superadmin or global users, allow SaaS and Society roles
                <>
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
                </>
              )}
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
