import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../Navbar/Navbar";
import Sidebar from "../../../SuperAdminDashboard/sidebar/Sidebar";
import axios from "axios";
import styles from "./EditPersonDetails.module.css";
import { toast } from "react-toastify";

const EditPersonDetails = () => {
  const [moduleTitle, setModuleTitle] = useState("Edit Person Details");
  const { personId } = useParams(); 
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]); 
  const [selectedHouses, setSelectedHouses] = useState([]); // ✅ Ensure it's an empty array
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

  // ✅ Fetch person's existing details
  useEffect(() => {
    if (personId) {
      axios.get(`http://localhost:5000/getPersonById/${personId}`)
        .then((response) => {
          console.log("✅ API Response:", response.data.person); // Debugging
          const personData = response.data.person;
          setFormData(personData);
          
          // ✅ Ensure house is an array before setting state
          setSelectedHouses(Array.isArray(personData.house) ? personData.house : []);
        })
        .catch((error) => {
          console.error("❌ Error fetching person details:", error);
        });
    }
  }, [personId]);
  
  
  

  // ✅ Fetch available houses
  useEffect(() => {
    if (societyId) {
      axios.get(`http://localhost:5000/api/get-houses/${societyId}`)
        .then((response) => {
          setHouses(response.data.houses);
        })
        .catch((error) => {
          console.error("❌ Error fetching houses:", error);
        });
    }
  }, [societyId]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setFormData({ ...formData, [e.target.name]: reader.result }); // ✅ Store Base64 in state
        };
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  

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
      // ✅ Convert images to Base64 if needed
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

      const imageBase64 = formData.image ? await convertToBase64(formData.image) : formData.image;
      const adharImageBase64 = formData.adharImage ? await convertToBase64(formData.adharImage) : formData.adharImage;

      const payload = {
        name: formData.name,
        address: formData.address,
        adharNo: formData.adharNo,
        gender: formData.gender,
        image: imageBase64,
        adharImage: adharImageBase64,
        house: selectedHouses, // ✅ Send selected houses
      };

      console.log("📤 Update Payload:", payload);

      const response = await axios.put(`http://localhost:5000/updatePersonDetails/${personId}`, payload);
      
      toast.success("✅ Person details updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("❌ Error updating person:", error);
      toast.error("❌ Error updating person. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className={styles.content}>
        <h2 className={styles.heading}>Edit Person Details</h2>

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

          
         {/* ✅ Display Previous Image */}
<div className={styles.formGroup}>
  <label>Current Image:</label>
  {formData.image && (
    <img 
      src={formData.image.startsWith("data:image") ? formData.image : `http://localhost:5000/uploads/${formData.image}`} 
      alt="Person" 
      className={styles.previewImage} 
    />
  )}
  <input type="file" name="image" accept="image/*" onChange={handleChange} />
</div>

{/* ✅ Display Previous Aadhar Image */}
<div className={styles.formGroup}>
  <label>Current Aadhar Image:</label>
  {formData.adharImage && (
    <img 
      src={formData.adharImage.startsWith("data:image") ? formData.adharImage : `http://localhost:5000/uploads/${formData.adharImage}`} 
      alt="Aadhar" 
      className={styles.previewImage} 
    />
  )}
  <input type="file" name="adharImage" accept="image/*" onChange={handleChange} />
</div>


          {/* ✅ House Selection */}
          <div className={styles.formGroup}>
            <label>House Selection:</label>
            <button type="button" onClick={() => setIsModalOpen(true)} className={styles.selectHouseBtn}>
              Select Houses
            </button>
            <div className={styles.selectedHouses}>
              {selectedHouses.length > 0 ? selectedHouses.join(", ") : "No houses selected"}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>Update Details</button>
            <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
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


    </div>
  );
};

export default EditPersonDetails;
