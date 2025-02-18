import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../Navbar/Navbar";
import Sidebar from "../../../SuperAdminDashboard/sidebar/Sidebar";
import axios from "axios";
import styles from "./PersonDetailes.module.css";
import { FaArrowLeft } from "react-icons/fa";

const PersonDetails = () => {
  const [moduleTitle, setModuleTitle] = useState("Person Details");
  const { personId } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch person details from API
  useEffect(() => {
    axios.get(`http://localhost:5000/getPersonById/${personId}`)
      .then((response) => {
        setPerson(response.data.person);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching person details:", error);
        setLoading(false);
      });
  }, [personId]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!person) {
    return <div className={styles.error}>❌ Person not found!</div>;
  }

  return (
    <div className={styles.container}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.content}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {/* ✅ Person Details Card */}
        <div className={styles.personCard}>
          {/* ✅ Profile & Aadhar Images */}
          <div className={styles.imageContainer}>
            <div className={styles.imageBox}>
              <img 
                src={person.image.startsWith("data:image") ? person.image : `http://localhost:5000/uploads/${person.image}`} 
                alt="Profile" 
                className={styles.profileImage} 
              />
              <p>Profile Picture</p>
            </div>

            <div className={styles.imageBox}>
              <img 
                src={person.adharImage.startsWith("data:image") ? person.adharImage : `http://localhost:5000/uploads/${person.adharImage}`} 
                alt="Aadhar" 
                className={styles.adharImage} 
              />
              <p>Aadhar Card</p>
            </div>
          </div>

          {/* ✅ Personal Information */}
          <div className={styles.details}>
            <h2>{person.name}</h2>
            <p><strong>Address:</strong> {person.address}</p>
            <p><strong>Aadhar No.:</strong> {person.adharNo}</p>
            <p><strong>Gender:</strong> {person.gender}</p>
            <p><strong>Houses:</strong> {person.house.length > 0 ? person.house.join(", ") : "No houses assigned"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
