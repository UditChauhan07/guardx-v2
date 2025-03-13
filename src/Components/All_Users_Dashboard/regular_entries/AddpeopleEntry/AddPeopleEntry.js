import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../Navbar/Navbar";
import Sidebar from "../../../SuperAdminDashboard/sidebar/Sidebar";
import axios from "axios";
import styles from "./AddPeopleEntry.module.css"; 
import { toast } from "react-toastify";

const AddPeopleEntry = () => {
  const [moduleTitle, setModuleTitle] = useState("Add People");
  const { entryId } = useParams();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]); 
  const [selectedHouses, setSelectedHouses] = useState([]); // Store selected houses
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [societyId, setSocietyId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    adharNo: "",
    gender: "Male",
    image: null,
    adharImage: null,
    house: [],
  });

  // ✅ Fetch society ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setSocietyId(userData.societyId || null);
    }
  }, []);

  // ✅ Fetch houses based on society ID
  useEffect(() => {
    if (societyId) {
      axios.get(`https://api-kpur6ixuza-uc.a.run.app

/api/get-houses/${societyId}`)
        .then((response) => {
          console.log("✅ Houses Fetched:", response.data.houses); // Debugging
          setHouses(response.data.houses);
        })
        .catch((error) => {
          console.error("❌ Error fetching houses:", error);
        });
    }
  }, [societyId]);
  
  

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Handle House Selection
  const toggleHouseSelection = (houseNo) => {
    setSelectedHouses((prev) => {
      let updatedHouses = Array.isArray(prev) ? [...prev] : []; // ✅ Ensure prev is an array
      if (updatedHouses.includes(houseNo)) {
        return updatedHouses.filter((h) => h !== houseNo);
      } else {
        return [...updatedHouses, houseNo];
      }
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert images to Base64
      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          if (file instanceof Blob) {  
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          } else {
            resolve(file); 
          }
        });
      };

      const imageBase64 = formData.image ? await convertToBase64(formData.image) : "";
      const adharImageBase64 = formData.adharImage ? await convertToBase64(formData.adharImage) : "";

      if (!societyId) {
        alert("❌ Society ID not found. Please log in again.");
        return;
      }

      const payload = {
        entryId,
        societyId, 
        name: formData.name,
        address: formData.address,
        adharNo: formData.adharNo,
        gender: formData.gender,
        image: imageBase64,
        adharImage: adharImageBase64,
        house: selectedHouses, // ✅ Send selected houses array
      };

      console.log("📤 Sending Payload:", payload);

      await axios.post("https://api-kpur6ixuza-uc.a.run.app/addPersonToEntry", payload);
      toast.success("✅ Person added successfully!");
      navigate(`/regular-entries/${entryId}`);
    } catch (error) {
      console.error("❌ Error adding person:", error);
      toast.error("❌ Error adding person. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.content}>
        <h2 className={styles.heading}>Add Person to Entry</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Aadhar No.:</label>
            <input type="text" name="adharNo" value={formData.adharNo} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Upload Image:</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Upload Aadhar Image:</label>
            <input type="file" name="adharImage" accept="image/*" onChange={handleChange} />
          </div>

          {/* ✅ House Selection Button */}
          <div className={styles.formGroup}>
            <label>House Selection:</label>
            <button type="button" onClick={() => setIsModalOpen(true)} className={styles.selectHouseBtn}>
              Select Houses
            </button>
            <div className={styles.selectedHouses}>
              {selectedHouses.length > 0 ? selectedHouses.join(", ") : "No houses selected"}
            </div>
          </div>
 {/* ✅ House Selection Modal */}
{isModalOpen && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h3 className={styles.modalTitle}>🏠 Select Houses</h3>

      <ul className={styles.houseList}>
        {houses.map((house) => {
          const isSelected = selectedHouses.includes(house.houseNo); // ✅ Check if house is selected
          return (
            <li
              key={house.id}
              className={`${styles.houseItem} ${isSelected ? styles.selectedHouse : ""}`} 
              onClick={() => toggleHouseSelection(house.houseNo)}
            >
              {house.houseNo}
              {isSelected && <span className={styles.checkmark}>✔</span>} {/* ✅ Show checkmark for selected houses */}
            </li>
          );
        })}
      </ul>

      <button onClick={() => setIsModalOpen(false)} className={styles.modalCloseBtn}>Close</button>
    </div>
  </div>
)}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>Add Person</button>
            <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPeopleEntry;
