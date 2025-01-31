import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SocietyDetails.css';

const SocietyDetails = () => {
  const { id } = useParams();  // To fetch the id from the URL
  const [society, setSociety] = useState(null);
  const navigate = useNavigate();

  // Fetch the society details by ID
  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-society/${id}`);
        setSociety(response.data.society);
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    };

    fetchSociety();
  }, [id]);

  const handleBack = () => {
    navigate('/society');  // Navigate back to the society listing page
  };

  if (!society) return <div>Loading...</div>;

  return (
    <div className="society-details-container">
      <button className="back-button" onClick={handleBack}>
        &lt; Back to Society List
      </button>

      <div className="society-details-content">
        <h2>Society Details</h2>
        <div className="details-container">
          <div className="detail-item">
            <strong>Society Name:</strong>
            <p>{society.societyName}</p>
          </div>

          <div className="detail-item">
            <strong>Address:</strong>
            <p>{society.address}</p>
          </div>

          <div className="detail-item">
            <strong>City:</strong>
            <p>{society.city}</p>
          </div>

          <div className="detail-item">
            <strong>State:</strong>
            <p>{society.state}</p>
          </div>

          <div className="detail-item">
            <strong>Contact No:</strong>
            <p>{society.contactNo}</p>
          </div>

          <div className="detail-item">
            <strong>Society Registration No:</strong>
            <p>{society.registrationNo}</p>
          </div>

          <div className="detail-item">
            <strong>Society Email:</strong>
            <p>{society.email}</p>
          </div>

          <div className="detail-item">
            <strong>No. of Houses:</strong>
            <p>{society.houses}</p>
          </div>

          <div className="detail-item">
            <strong>Status:</strong>
            <p>{society.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocietyDetails;
