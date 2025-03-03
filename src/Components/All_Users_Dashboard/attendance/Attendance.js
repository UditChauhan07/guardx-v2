import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../SuperAdminDashboard/sidebar/Sidebar";
import { FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";
import styles from "./Attendance.module.css";

const Attendance = () => {
  const [moduleTitle, setModuleTitle] = useState("Attendance");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Get the user object from localStorage & extract societyId
  const user = JSON.parse(localStorage.getItem("user"));
  const { societyId, role, permissions } = user;
  
  // ✅ Check if user has permission to view attendance
  const hasAttendanceAccess = role === "superadmin" || permissions?.attendance?.read;
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        if (!societyId) {
          console.error("❌ Society ID not found in user object");
          return;
        }

        const response = await axios.get(
          `https://api-kpur6ixuza-uc.a.run.app/api/attendance/${societyId}`
        );

        console.log("📌 Attendance API Response:", response.data);

        setAttendanceRecords(response.data);
        setFilteredRecords(response.data); // ✅ Initialize filtered records
        setLoading(false);
      } catch (error) {
        console.error("🔥 Error fetching attendance:", error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [societyId]);

  // ✅ Function to format date & time correctly
  const formatDateTime = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
      return date.toLocaleString();
    }
    return "Invalid Date";
  };

  // ✅ Delete attendance record
  const handleDeleteAttendance = async (attendanceId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this attendance record?"
      );
      if (!confirmDelete) return;

      await axios.delete(`https://api-kpur6ixuza-uc.a.run.app/api/delete-attendance/${attendanceId}`);

      // ✅ Remove deleted record from state
      setAttendanceRecords(attendanceRecords.filter((record) => record.id !== attendanceId));
      setFilteredRecords(filteredRecords.filter((record) => record.id !== attendanceId));

      alert("✅ Attendance record deleted successfully!");
    } catch (error) {
      console.error("🔥 Error deleting attendance:", error);
      alert("❌ Failed to delete attendance. Please try again.");
    }
  };

  // ✅ Filter records based on search term & date
  useEffect(() => {
    let filtered = attendanceRecords;

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((record) => {
        const loginDate = new Date(record.loginTime._seconds * 1000).toISOString().split("T")[0];
        return loginDate === selectedDate;
      });
    }

    setFilteredRecords(filtered);
  }, [searchTerm, selectedDate, attendanceRecords]);

  return (
    <div className={styles.container}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.content}>
        <h2 className={styles.heading}>📅 Attendance Records</h2>
        {!hasAttendanceAccess ? (
          <p className={styles.noAccess}>❌ You do not have permission to view attendance history.</p>
        ) : (
          <>

        {/* ✅ Search Bar & Date Filter */}
        <div className={styles.filters}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by Name or Role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <input
            type="date"
            className={styles.dateFilter}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading attendance records...</p>
        ) : filteredRecords.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className={styles.attendanceTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th> {/* ✅ New Column for Role */}
                <th>Clock-In</th>
                <th>Clock-Out</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const isActive = !record.logoutTime; // 🔹 Check if logout time is missing (Active)
                return (
                  <tr key={record.id} className={isActive ? styles.activeRow : ""}>
                    <td>{record.name || "-"}</td>
                    <td>{record.role || "N/A"}</td> {/* ✅ Display Role */}
                    <td>{formatDateTime(record.loginTime)}</td>
                    <td>{isActive ? "Active" : formatDateTime(record.logoutTime)}</td>
                    <td>
                      <button
                        className={`${styles.deleteButton} ${isActive ? styles.disabledButton : ""}`}
                        onClick={() => handleDeleteAttendance(record.id)}
                        disabled={isActive} // 🔹 Disable button if user is still active
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        </>
      )}
      </div>
    </div>
  );
};

export default Attendance;
