import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import Guard_Navbar from '../Guard_Navbar/Guard_Navbar';
import styles from './Visitors_List.module.css';

const Visitors_List = () => {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Get Society ID from Local Storage
  const user = JSON.parse(localStorage.getItem('user'));
  const societyId = user?.societyId;

  useEffect(() => {
    fetchVisitors();
  }, []);

  // ✅ Fetch Visitors Data
  const fetchVisitors = async () => {
    if (!societyId) return;
    setLoading(true);
    try {
      const response = await fetch(`https://api-kpur6ixuza-uc.a.run.app/api/getVisitorEntries/${societyId}`);
      const data = await response.json();
      setVisitors(data.entries || []);
      setFilteredVisitors(data.entries || []); // ✅ Initialize filtered data
    } catch (error) {
      console.error("❌ Error fetching visitors:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format Date & Time
  const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return "N/A";
    
    const date = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
    
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Handle Clock Out
  const handleClockOut = async (visitorId) => {
    try {
      const response = await fetch(`https://api-kpur6ixuza-uc.a.run.app/api/visitor/clock-out/${visitorId}`, {
        method: "PUT",
      });

      if (response.ok) {
        const updatedVisitors = visitors.map((visitor) =>
          visitor.id === visitorId
            ? { ...visitor, clockOutTime: { _seconds: Date.now() / 1000, _nanoseconds: 0 } }
            : visitor
        );
        setVisitors(updatedVisitors);
        setFilteredVisitors(updatedVisitors); // ✅ Update filtered list
      } else {
        console.error("❌ Failed to clock out visitor");
        fetchVisitors();
      }
    } catch (error) {
      console.error("🔥 Error updating clock-out time:", error);
    }
  };

  // ✅ Search Functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = visitors.filter(visitor =>
      visitor.visitorName.toLowerCase().includes(query)
    );

    setFilteredVisitors(filtered);
  };

  return (
    <>
      <Guard_Navbar />
      <div className={styles.container}>
        
        {/* ✅ Back Button */}
        <button className={styles.backButton} onClick={() => window.history.back()}>
          <FaArrowLeft className={styles.backIcon} /> Back
        </button>

        <h2 className={styles.heading}>🚪 Visitors List</h2>

        {/* ✅ Search Bar */}
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by Name..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <p className={styles.loadingText}>Loading visitors...</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.length > 0 ? (
                  filteredVisitors.map((visitor, index) => (
                    <tr key={visitor.id} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                      <td>{visitor.visitorName || "N/A"}</td>
                      <td>{visitor.visitorPhone || "N/A"}</td>
                      <td>{formatDateTime(visitor.createdAt)}</td>
                      <td>{visitor.clockOutTime ? formatDateTime(visitor.clockOutTime) : "Pending"}</td>
                      <td>
                        {visitor.clockOutTime ? (
                          <button className={styles.disabledBtn} disabled>Clocked Out</button>
                        ) : (
                          <button 
                            className={styles.clockOutBtn} 
                            onClick={() => handleClockOut(visitor.id)}
                          >
                            Clock Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.noData}>No visitors found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Visitors_List;
