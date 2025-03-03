import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Guest_Entries_info.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const Guest_Entries_info = () => {
  const { entryId } = useParams();
  const [visitorDetails, setVisitorDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (entryId) {
      fetchVisitorDetails();
    }
  }, [entryId]);

  // ✅ Fetch Visitor Details from API
  const fetchVisitorDetails = async () => {
    try {
      const response = await axios.get(
        `https://api-kpur6ixuza-uc.a.run.app/api/getVisitorEntry/${entryId}`
      );
      setVisitorDetails(response.data);
    } catch (error) {
      console.error("❌ Error fetching visitor details:", error);
      toast.error("❌ Failed to load visitor details.");
    }
  };

  // ✅ Format Timestamp to Readable Date
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return "N/A";
    return new Date(timestamp._seconds * 1000).toLocaleString();
  };

  if (!visitorDetails) {
    return <p className={styles.loading}>Loading visitor details...</p>;
  }

  return (
    <div className={styles.container}>
      {/* Header Section with Back Button */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2>Visitor Information</h2>
      </div>

      {/* Visitor Basic Information */}
      <div className={styles.card}>
        <h3>Visitor Details</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <strong>Name:</strong> {visitorDetails.visitorName}
          </div>
          <div className={styles.infoItem}>
            <strong>Phone:</strong> {visitorDetails.visitorPhone}
          </div>
          <div className={styles.infoItem}>
            <strong>Entry Type:</strong> {visitorDetails.entryType || "N/A"}
          </div>
          <div className={styles.infoItem}>
            <strong>Purpose of Visit:</strong> {visitorDetails.purpose || "N/A"}
          </div>
        </div>
      </div>

      {/* House & Entry Details */}
      <div className={styles.card}>
        <h3>House Details</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <strong>House No:</strong> {visitorDetails.house?.houseNo || "N/A"}
          </div>
          <div className={styles.infoItem}>
            <strong>Block:</strong> {visitorDetails.house?.blockNo || "N/A"}
          </div>

        </div>
      </div>

      {/* Entry & Exit Timestamps */}
      <div className={styles.card}>
        <h3>Entry Timestamps</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <strong>Clock In:</strong> {formatTimestamp(visitorDetails.clockInTime)}
          </div>
          <div className={styles.infoItem}>
            <strong>Clock Out:</strong> {visitorDetails.clockOutTime ? formatTimestamp(visitorDetails.clockOutTime) : "Still Inside"}
          </div>
        </div>
      </div>

      {/* Visitor Photos */}
      <div className={styles.imageCard}>
        <h3>Visitor Photos</h3>
        <div className={styles.imageGrid}>
        <div className={styles.imageItem}>
            <strong>Live Photo:</strong>
            <img 
              src={visitorDetails.livePhoto} 
              alt="Live Capture" 
              className={styles.image} 
            />
          </div>
          <div className={styles.imageItem}>
            <strong>Aadhar Photo:</strong>
            <img 
              src={visitorDetails.aadharPhoto} 
              alt="Aadhar Capture" 
              className={styles.image} 
            />
          </div>
        </div>
      </div>

      {/* Visitor Status */}
      <div className={styles.card}>
        <h3>Current Status</h3>
        <p className={visitorDetails.clockOutTime ? styles.statusExited : styles.statusInside}>
          {visitorDetails.clockOutTime ? "Visitor has exited" : "Visitor is still inside"}
        </p>
      </div>
    </div>
  );
};

export default Guest_Entries_info;
