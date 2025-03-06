import React, { useState } from 'react';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import './AddSociety.css';
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const AddSociety = () => {
  const [moduleTitle, setModuleTitle] = useState('Add Society');
  
  const [formData, setFormData] = useState({
    societyName: '',
    address: '',
    city: '',
    state: '',
    contactNo: '',
    registrationNo: '',
    email: '',
    houses: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send API request to backend in JSON format
      const response = await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-society', formData, {
        headers: {
          'Content-Type': 'application/json', // Send as JSON
        },
      });

      // Handle success response
      toast.success('Society added successfully!');
      console.log(response.data);

      // Reset the form after successful submission
      setFormData({
        societyName: '',
        address: '',
        city: '',
        state: '',
        contactNo: '',
        registrationNo: '',
        email: '',
        houses: '',
      });
      navigate('/society')
    } catch (error) {
      console.error('Error adding society:', error);
      toast.warning('Error adding society. Please try again.');
    }
  };

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };
const navigate = useNavigate();
const back = () => { 
  navigate('/society');}

  return (
    <div className="add-society-container">
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={handleSidebarClick} />
      <h2 className="page-title">{moduleTitle}</h2>

      <div className="add-society-content">
        <form className="add-society-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-wrapper2">
              <label>Society Name <span className="required">*</span></label>
              <input
                type="text"
                name="societyName"
                value={formData.societyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-wrapper2">
              <label>Address <span className="required">*</span></label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-wrapper2">
              <label>State <span className="required">*</span></label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-wrapper2">
              <label>City <span className="required">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-wrapper2">
              <label>Contact No. <span className="required">*</span></label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-wrapper2">
              <label>Society Registration No. <span className="required">*</span></label>
              <input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-wrapper2">
              <label>Society Email <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-wrapper2">
              <label>No. of Houses in Society <span className="required">*</span></label>
              <select
                name="houses"
                value={formData.houses}
                onChange={handleChange}
                required
              >
                <option value="">Select House Range</option>
                <option value="1-50">1-50</option>
                <option value="51-100">51-100</option>
                <option value="101-200">101-200</option>
                <option value="201+">201+</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button1">Save</button>
            <button type="reset" className="cancel-button1" onClick={back}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSociety;
