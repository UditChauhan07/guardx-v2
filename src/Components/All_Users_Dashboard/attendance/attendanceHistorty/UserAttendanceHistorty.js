import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserAttendanceHistory.module.css";

const UserAttendanceHistory = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [searchDate, setSearchDate] = useState(""); // Search date
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

  // Convert Firestore timestamp to readable date
  const formatDateTime = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000);
      return date.toLocaleString();
    }
    return "N/A";
  };

  // Fetch attendance history
  useEffect(() => {
    const fetchUserAttendance = async () => {
      if (!userData || !userData.id) {
        console.error("User ID not found in local storage");
        setError("User ID not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api-kpur6ixuza-uc.a.run.app/api/user-attendance/${userData.id}`
        );
        const result = await response.json();

        if (response.ok) {
          console.log("User Attendance History:", result.data);
          setAttendanceData(result.data || []); // ✅ Store full attendance data
          setFilteredData(result.data || []); // ✅ Default filtered data
          setUserName(userData.name || "User");
        } else {
          console.error("Error fetching attendance:", result.message);
          setError(result.message || "Failed to fetch attendance records.");
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAttendance();
  }, []);

  // Filter attendance by selected date
  useEffect(() => {
    if (searchDate) {
      const filtered = attendanceData.filter((record) => {
        const recordDate = new Date(record.loginTime._seconds * 1000)
          .toISOString()
          .split("T")[0]; // Convert to YYYY-MM-DD
        return recordDate === searchDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(attendanceData);
    }
  }, [searchDate, attendanceData]);

  return (
    <div className={styles.container}>
      {/* 🔹 Back Button & Search Bar */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ⬅️ Back
        </button>
        <input
          type="date"
          className={styles.searchBar}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <h2 className={styles.heading}>📌 {userName}'s Attendance History</h2>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : filteredData.length === 0 ? (
        <p className={styles.noData}>No attendance records found.</p>
      ) : (
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>S_No.</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => {
              const login = formatDateTime(record.loginTime);
              const logout = formatDateTime(record.logoutTime);
              const duration = record.logoutTime?._seconds
                ? `${Math.floor(
                    (record.logoutTime._seconds - record.loginTime._seconds) /
                      60
                  )} mins`
                : "Still Active";

              return (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{login}</td>
                  <td>{logout}</td>
                  <td>{duration}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserAttendanceHistory;
