import React, { useState, useEffect } from "react";
import axios from "axios";
import Guard_Navbar from "../Guard_Navbar/Guard_Navbar";
import styles from "./Add_Visitor.module.css";
import { useNavigate } from "react-router-dom";
import { FaBackspace } from "react-icons/fa";
import { toast } from "react-toastify";


const Add_Visitors = () => {
  const [step, setStep] = useState(1);
  const [societyEntries, setSocietyEntries] = useState([]);
  const [entryId, setEntryId] = useState(null);
  const [purposes, setPurposes] = useState([]);
  const [purposeId, setPurposeId] = useState(null);
  const [houses, setHouses] = useState([]);
  const [houseId, setHouseId] = useState(null);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [livePhoto, setLivePhoto] = useState(null);
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [societyId, setSocietyId] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch societyId from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setSocietyId(parsedUser.societyId);
    }
  }, []);

  // ✅ Fetch Society Entries
  useEffect(() => {
    if (!societyId) return;
    fetchSocietyEntries();
  }, [societyId]);

  const fetchSocietyEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/society/get-entries/${societyId}`);
      setSocietyEntries(response.data.entries || []);
    } catch (error) {
      console.error("❌ Error fetching society entries:", error);
    }
    setLoading(false);
  };

  // ✅ Fetch Purposes
  const fetchPurposes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/society/get-purposes/${societyId}`);
      setPurposes(response.data.purposes || []);
    } catch (error) {
      console.error("❌ Error fetching purposes:", error);
    }
    setLoading(false);
  };

  // ✅ Fetch Houses
  const fetchHouses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-houses/${societyId}`);
      setHouses(response.data.houses || []);
    } catch (error) {
      console.error("❌ Error fetching houses:", error);
    }
    setLoading(false);
  };

  // ✅ Handle Entry Selection
  const handleEntrySelect = (entry) => {
    console.log("🔍 Selected Entry ID:", entry.id);
    setEntryId(entry.id);
    fetchPurposes();
    setStep(2);
  };

  // ✅ Handle Purpose Selection
  const handlePurposeSelect = (purpose) => {
    console.log("🔍 Selected Purpose ID:", purpose.id);
    setPurposeId(purpose.id);
    fetchHouses();
    setStep(3);
  };

  // ✅ Handle House Selection
  const handleHouseSelect = (house) => {
    console.log("🔍 Selected House ID:", house.id);
    setHouseId(house.id);
    setStep(4);
  };

  // ✅ Convert Image File to Base64
const handleImageUpload = async (file, setImage) => {
  if (!file) return;

  // 🔥 Convert File to Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    setImage(reader.result); // ✅ Store Base64 in state
    console.log("📸 Converted Image to Base64:", reader.result);
  };

  reader.onerror = (error) => {
    console.error("❌ Error converting image to Base64:", error);
    toast.error("❌ Failed to convert image.");
  };
};

  

const handleSubmit = async () => {
  if (!societyId || !entryId || !purposeId || !houseId || !visitorName || !visitorPhone || !livePhoto || !aadharPhoto) {
    alert("⚠️ Please fill all required fields before submitting.");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      societyId,
      entryId,
      purposeId,
      houseId,
      visitorName,
      visitorPhone,
      livePhoto,  // ✅ Base64 Image
      aadharPhoto, // ✅ Base64 Image
    };

    console.log("📤 Sending Payload:", payload);

    const response = await axios.post(
      "https://api-kpur6ixuza-uc.a.run.app/api/visitor/addVisitorEntry",
      payload
    );

    console.log("✅ Visitor Entry Added Successfully:", response.data);
    toast.success("🎉 Visitor entry added successfully!");

    // Reset form after submission
    setStep(1);
    setEntryId(null);
    setPurposeId(null);
    setHouseId(null);
    setVisitorName("");
    setVisitorPhone("");
    setLivePhoto(null);
    setAadharPhoto(null);
  } catch (error) {
    console.error("❌ API Error Response:", error.response?.data || error.message);
    toast.error(`❌ Failed to add visitor entry: ${error.response?.data?.error || error.message}`);
  }

  setLoading(false);
};

  return (
    <>
      <Guard_Navbar />
      <div className={styles.container}>
      <button className={styles.closeButton} onClick={() => navigate("/guard-dashboard")}><FaBackspace/></button>
        {/* Progress Indicator */}
        <div className={styles.progressBar}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>1</div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>2</div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ""}`}>3</div>
        </div>

        {/* Step 1: Select Entry */}
        {step === 1 && (
          <>
            <h2>Select an Entry</h2>
            {loading ? (
              <p>Loading society entries...</p>
            ) : societyEntries.length > 0 ? (
              <div className={styles.entriesGrid}>
                {societyEntries.map((entry, index) => (
                  <div key={index} className={styles.entryCard} onClick={() => handleEntrySelect(entry)}>
                    <img src={entry.logo || "default-logo.png"} alt={entry.title} className={styles.logo} />
                    <h3>{entry.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p>No society entries found.</p>
            )}
          </>
        )}

        {/* Step 2: Show Purposes */}
        {step === 2 && (
          <>
            <h2> Select Purposes </h2>
            {loading ? (
              <p>Loading purposes...</p>
            ) : purposes.length > 0 ? (
              <div className={styles.purposeGrid}>
                {purposes.map((purpose, index) => (
                  <div key={index} className={styles.purposeCard} onClick={() => handlePurposeSelect(purpose)}>
                    <img src={purpose.icon || "default-icon.png"} alt={purpose.purpose} className={styles.purposeIcon} />
                    <p>{purpose.purpose}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No purposes found.</p>
            )}
            
          </>
        )}

        {/* Step 3: Show Houses */}
{step === 3 && (
    <>
        <h2>Houses in the Society</h2>
        {loading ? (
            <p>Loading houses...</p>
        ) : houses.length > 0 ? (
            <ul className={styles.houseList}>
                {houses.map((house, index) => (
                    <li key={index} className={styles.houseItem}onClick={() =>handleHouseSelect(house)}>
                        <strong>Block:</strong> {house.blockNo} | <strong>House No:</strong> {house.houseNo} | <strong>Status:</strong> {house.status}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No houses found.</p>
        )}
        
    </>
)}
{/* Step 4: Visitor Details */}
        {step === 4 && (
  <div className={styles.visitorForm}>
    <h2>Visitor Details</h2>

    <label>Name:</label>
    <input type="text" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Enter visitor name" />

    <label>Phone:</label>
    <input type="text" value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} placeholder="Enter visitor phone number" />

    <label>Live Photo:</label>
    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], setLivePhoto)} />

    {livePhoto && (
      <div className={styles.previewContainer}>
        <img src={livePhoto} alt="Live Capture" className={styles.preview} />
      </div>
    )}

    <label>Aadhar Card Photo:</label>
    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], setAadharPhoto)} />

    {aadharPhoto && (
      <div className={styles.previewContainer}>
        <img src={aadharPhoto} alt="Aadhar Capture" className={styles.preview} />
      </div>
    )}

    <button onClick={handleSubmit} className={styles.submitButton} disabled={loading}>
      {loading ? "Saving..." : "Submit Visitor Entry"}
    </button>

    <button onClick={() => setStep(3)} className={styles.backButton}>
      Back
    </button>
  </div>
)}


      </div>
    </>
  );
};

export default Add_Visitors;
