import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../SuperAdminDashboard/sidebar/Sidebar';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaEye, FaFingerprint } from 'react-icons/fa';
import styles from './Regular_entries.module.css'; 

const RegularEntries = () => {
  const [moduleTitle, setModuleTitle] = useState('Regular Entries');
  const [searchTerm, setSearchTerm] = useState('');
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();
  const { entryId } = useParams(); 
  const [societyId, setSocietyId] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("✅ Retrieved Society ID from Local Storage:", userData.societyId); // Debugging
      setSocietyId(userData.societyId || null);
    } else {
      console.warn("⚠️ No user data found in local storage.");
    }
  }, []);
  
  useEffect(() => {
    console.log("✅ Entry ID from URL:", entryId); // Debugging
  
    if (societyId && entryId) {
      console.log("✅ Fetching people for Entry ID:", entryId, "Society ID:", societyId);
      fetchPeople();
    } else {
      console.warn("⚠️ Waiting for societyId and entryId before fetching data.");
    }
  }, [societyId, entryId]);
  
  
  

  // ✅ Fetch all people in this regular entry
  const fetchPeople = async () => {
    try {
      console.log(`🔍 API Request: https://api-kpur6ixuza-uc.a.run.app/getPeopleByEntry/${entryId}/${societyId}`);
      const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/getPeopleByEntry/${entryId}/${societyId}`);
  
      console.log("✅ API Response:", response.data);
  
      if (Array.isArray(response.data.people)) {
        setPeople(response.data.people);
      } else {
        console.warn("⚠️ API response does not contain an array. Check backend response.");
        setPeople([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("❌ Error fetching people:", error);
      setPeople([]); // Fallback to empty array
    }
  };
  
  

  // ✅ Delete person
  const handleDelete = async (personId) => {
    try {
      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app
/deletePersonFromEntry/${personId}`);
      fetchPeople(); // Refresh list
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  return (
    <div className={styles.regularEntriesContainer}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.content}>
        {/* ✅ Top Bar with Add Button and Search */}
        <div className={styles.topBar}>
          <button className={styles.addButton} onClick={() => navigate(`/add-person/${entryId}`)}>
            <FaPlus /> Add Person
          </button>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by Name or Aadhar No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ✅ Table to Show People */}
        <table className={styles.peopleTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Aadhar No.</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {people.length > 0 ? (
    people.map((person) => (
      <tr key={person.id}>
        <td>{person.name}</td>
        <td>{person.gender}</td>
        <td>{person.adharNo}</td>
        <td className={styles.actionButtons}>
        <button className={styles.editBtn} onClick={() => navigate(`/edit-person/${person.id}`)}>
  <FaEdit />
</button>
          <button className={styles.viewBtn} onClick={() => navigate(`/person-details/${person.id}`)}>
            <FaEye />
          </button>
          <button className={styles.deleteBtn} onClick={() => handleDelete(person.id)}>
            <FaTrash />
          </button>
          <button className={styles.fingerprintBtn} onClick={() => navigate(`/attendance/${person.id}`)}>
            <FaFingerprint />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className={styles.noDataMessage}>
        <strong>⚠️ No people found in this entry.</strong>
        <pre>{JSON.stringify(people, null, 2)}</pre>
      </td>
    </tr>
  )}
</tbody>


        </table>
      </div>
    </div>
  );
};

export default RegularEntries;
