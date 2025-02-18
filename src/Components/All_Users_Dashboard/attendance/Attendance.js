import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../SuperAdminDashboard/sidebar/Sidebar";
import { FaTrash } from "react-icons/fa";
import styles from "./Attendance.module.css";


const Attendance = () => {
  const [moduleTitle, setModuleTitle] = useState("Attendance");

  // ✅ Fetch Attendance Data
  // useEffect(() => {
  //   axios
  //     .get("https://api-kpur6ixuza-uc.a.run.app
/getAttendanceRecords")
  //     .then((response) => {
  //       setAttendance(response.data.records);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("❌ Error fetching attendance records:", error);
  //       setLoading(false);
  //     });
  // }, []);

  // ✅ Handle Delete Attendance Record
  // const handleDelete = (id) => {
  //   if (!window.confirm("Are you sure you want to delete this record?")) return;

  //   axios
  //     .delete(`https://api-kpur6ixuza-uc.a.run.app
/deleteAttendance/${id}`)
  //     .then(() => {
  //       toast.success("✅ Attendance record deleted!");
  //       setAttendance((prev) => prev.filter((record) => record.id !== id));
  //     })
  //     .catch((error) => {
  //       console.error("❌ Error deleting record:", error);
  //       toast.error("❌ Failed to delete record");
  //     });
  // };

  return (
    <div className={styles.container}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.content}>
        <h2 className={styles.heading}>📅 Attendance Records</h2>
          <table className={styles.attendanceTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Clock-In</th>
                <th>Clock-Out</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>
                    <button className={styles.deleteButton} >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default Attendance;
