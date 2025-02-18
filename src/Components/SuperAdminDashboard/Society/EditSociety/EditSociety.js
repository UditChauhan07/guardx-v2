import React, { useState, useEffect } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditSociety.css';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';

const EditSociety = () => {
  const { id } = useParams(); 
  const history = useNavigate();
  const [formData, setFormData] = useState({
    societyName: '',
    address: '',
    city: '',
    state: '',
    contactNo: '',
    registrationNo: '',
    email: '',
    houses: ''
  });

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app
/api/get-society/${id}`);
        const society = response.data.society;
        setFormData({
          societyName: society.societyName,
          address: society.address,
          city: society.city,
          state: society.state,
          contactNo: society.contactNo,
          registrationNo: society.registrationNo,
          email: society.email,
          houses: society.houses
        });
      } catch (error) {
        console.error('Error fetching society data:', error);
      }
    };

    fetchSociety();
  }, [id]);

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
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app
/api/update-society/${id}`, formData);
      history('/society'); 
    } catch (error) {
      console.error('Error updating society:', error);
    }
  };
   const [moduleTitle, setModuleTitle] = useState('Edit Society Details');
  const handleSidebarClick = (title) => {
    setModuleTitle(title);  
  };
const back = ()=>{
    history("/society")
}
  return (
    <div className='edit'>
  <Navbar moduleTitle={moduleTitle} />
    <Sidebar onClick={handleSidebarClick} />
    <div className="edit-society-container">
      <h2 className="page-title">Edit Society Details</h2>
      <form className="edit-society-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="input-wrapper">
            <label>Society Name <span className="required">*</span></label>
            <input
              type="text"
              name="societyName"
              value={formData.societyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
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

        <div className="form-section">
          <div className="input-wrapper">
            <label>City <span className="required">*</span></label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <label>State <span className="required">*</span></label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <div className="input-wrapper">
            <label>Contact No. <span className="required">*</span></label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
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

        <div className="form-section">
          <div className="input-wrapper">
            <label>Society Email <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-wrapper">
            <label>No. of Houses in Society <span className="required">*</span></label>
            <select
              name="houses"
              value={formData.houses}
              onChange={handleChange}
              required
            >
              <option value="">Select House Range</option>
              <option value="0-250">0 - 250</option>
              <option value="251-500">251 - 500</option>
              <option value="501-1000">501 - 1000</option>
              <option value="1001+">1001+</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">Save</button>
          <button type="reset" className="cancel-button"onClick={back}>Cancel</button>
        </div>
      </form>
    </div>
    </div>
  
  );
};

export default EditSociety;
