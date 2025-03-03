import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../SuperAdminDashboard/sidebar/Sidebar";
import styles from "./Guest_entries.module.css";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const Guest_Entries = () => {
  const [moduleTitle, setModuleTitle] = useState("Guest Entries");
  const [visitorEntries, setVisitorEntries] = useState([]);
  const [houses, setHouses] = useState({});
  const [entryTypes, setEntryTypes] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch societyId from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const societyId = user?.societyId;
  const permissions = user?.permissions?.guestEntriesRequest || {}; // Get guest entries permissions

  const hasViewPermission = permissions.view === true;
  const hasDeletePermission = permissions.delete === true;
  useEffect(() => {
    if (societyId) {
      fetchVisitorEntries();
      fetchHouses();
      fetchEntryTypes();
    } else {
      toast.error("⚠️ Society ID is missing! Please log in again.");
    }
  }, [societyId]);

  // ✅ Fetch Visitor Entries
  const fetchVisitorEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api-kpur6ixuza-uc.a.run.app/api/getVisitorEntries/${societyId}`
      );
      setVisitorEntries(response.data.entries || []);
    } catch (error) {
      console.error("❌ Error fetching visitor entries:", error);
      toast.error("❌ Failed to fetch visitor entries.");
    }
    setLoading(false);
  };

  // ✅ Fetch Houses and Map them by ID
  const fetchHouses = async () => {
    try {
      const response = await axios.get(
        `https://api-kpur6ixuza-uc.a.run.app/api/get-houses/${societyId}`
      );
      const houseMap = {};
      response.data.houses.forEach((house) => {
        houseMap[house.id] = {
          houseNo: house.houseNo,
          blockNo: house.blockNo,
        };
      });
      setHouses(houseMap);
    } catch (error) {
      console.error("❌ Error fetching houses:", error);
    }
  };

  // ✅ Fetch Entry Types and Map them by ID
  const fetchEntryTypes = async () => {
    try {
      const response = await axios.get(
        `https://api-kpur6ixuza-uc.a.run.app/api/society/get-entries/${societyId}`
      );
      const entryMap = {};
      response.data.entries.forEach((entry) => {
        entryMap[entry.id] = entry.title; // Store entry title by ID
      });
      setEntryTypes(entryMap);
    } catch (error) {
      console.error("❌ Error fetching entry types:", error);
    }
  };

  // ✅ Format Timestamp to Readable Date
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return "N/A";
    return new Date(timestamp._seconds * 1000).toLocaleString();
  };

  // ✅ Delete Visitor Entry
  const handleDelete = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(
        `https://api-kpur6ixuza-uc.a.run.app/api/deleteVisitorEntry/${entryId}`
      );
      toast.success("✅ Visitor entry deleted successfully!");
      fetchVisitorEntries(); // Refresh list
    } catch (error) {
      console.error("❌ Error deleting entry:", error);
      toast.error("❌ Failed to delete visitor entry.");
    }
  };

  // ✅ Navigate to Entry Details Page
  const handleViewDetails = (entryId) => {
    navigate(`/visitor-details/${entryId}`);
  };

  return (
    <div className={styles.wrapper}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={setModuleTitle} />

      <div className={styles.container}>
        <h2>Guest Entries</h2>

        {loading ? (
          <p>Loading visitor entries...</p>
        ) : visitorEntries.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>House No. & Block</th>
                <th>Entry Type</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitorEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.visitorName || "N/A"}</td>
                  <td>
                    {houses[entry.houseId]
                      ? `${houses[entry.houseId].houseNo} (Block ${houses[entry.houseId].blockNo})`
                      : "N/A"}
                  </td>
                  <td>{entryTypes[entry.entryId] || "N/A"}</td>
                  <td>{formatTimestamp(entry.clockInTime)}</td>
                  <td>{entry.clockOutTime ? formatTimestamp(entry.clockOutTime) : "Still Inside"}</td>
                  <td>
                  <button
  className={`${styles.viewBtn} ${!hasViewPermission ? styles.disabled : ""}`}
  onClick={() => handleViewDetails(entry.id)}
  disabled={hasViewPermission !== true}
>
  <FaEye />
</button>

<button
  className={`${styles.deleteBtn} ${!hasDeletePermission ? styles.disabled : ""}`}
  onClick={() => handleDelete(entry.id)}
  disabled={hasDeletePermission !== true}
>
  <FaTrash />
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No visitor entries found.</p>
        )}
      </div>
    </div>
  );
};

export default Guest_Entries;
