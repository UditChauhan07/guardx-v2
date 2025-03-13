import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditSociety.css';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import { toast } from 'react-toastify';

const EditSociety = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    societyName: '',
    address: '',
    city: '',
    state: '',
    contactNo: '',
    registrationNo: '',
    email: '',
    houseRange: '',
    plan: { planName: '', interval: '', pricePerHousehold: '', currency: '' },
    discount: { type: '', value: '' }
  });

  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]); 

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/get-society/${id}`);
        const society = response.data.society;
        setFormData(society);
      } catch (error) {
        console.error('Error fetching society data:', error);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/subscription/all');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchSociety();
    fetchPlans();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle House Range Change
  const handleHouseRangeChange = (e) => {
    const houseRange = e.target.value;
    setFormData((prev) => ({
      ...prev,
      houseRange,
      plan: { planName: '', interval: '', pricePerHousehold: '', currency: '' }
    }));

    const filtered = plans.filter(plan => plan.houseRange === houseRange);
    setFilteredPlans(filtered);

    if (filtered.length > 0) {
      setFormData(prev => ({
        ...prev,
        plan: {
          planName: filtered[0].planName,
          interval: filtered[0].interval,
          pricePerHousehold: filtered[0].pricePerHousehold,
          currency: filtered[0].currency
        }
      }));
    }
  };

  // Handle Plan Change
  const handlePlanChange = (e) => {
    const selectedPlanName = e.target.value;

    if (selectedPlanName === 'Custom') {
      setFormData((prev) => ({
        ...prev,
        plan: { planName: 'Custom', interval: '', pricePerHousehold: '', currency: '' }
      }));
    } else {
      const selectedPlan = plans.find(plan => plan.planName === selectedPlanName);
      setFormData((prev) => ({
        ...prev,
        plan: selectedPlan ? { ...selectedPlan } : { planName: '', interval: '', pricePerHousehold: '', currency: '' }
      }));
    }
  };

  // Handle Interval Change
  const handleIntervalChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      plan: { ...prev.plan, interval: e.target.value }
    }));
  };

  // Handle Discount Change
  const handleDiscountTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      discount: { type: e.target.value, value: '' }
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://api-kpur6ixuza-uc.a.run.app
/api/update-society/${id}`, formData);
      navigate('/society');
    } catch (error) {
        const errorMessage =
          error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : 'An unexpected error occurred. Please try again.';
    
        toast.warning(errorMessage);
      }
  };
   const [moduleTitle, setModuleTitle] = useState('Edit Society Details');
  const handleSidebarClick = (title) => {
    setModuleTitle(title);  
  };

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
           {/* House Range Selection */}
           <div className="input-wrapper">
            <label>House Range *</label>
            <select name="houseRange" value={formData.houseRange} onChange={handleHouseRangeChange} required>
              <option value="">Select House Range</option>
              <option value="0-250">0-250</option>
              <option value="250-500">250-500</option>
              <option value="500+">500+</option>
            </select>
          </div>
          </div>

          {/* Plan Selection */}
          <div className="plan-container">
            <div className="input-wrapper">
              <label>Plan Name *</label>
              <select name="planName" value={formData.plan?.planName} onChange={handlePlanChange} required>
                {plans.map(plan => (
                  <option key={plan.planName} value={plan?.planName}>{plan.planName}</option>
                ))}
                <option value="Custom">Custom Plan</option>
              </select>
            </div>
            <div className="input-wrapper">
              <label>Interval *</label>
              <select name="interval" value={formData.plan?.interval} onChange={handleIntervalChange} required>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          {/* Custom Plan Fields */}
          {formData.plan?.planName === 'Custom' && (
            <div className="custom-plan-container">
              <div className="input-wrapper">
                <label>Price Per Household *</label>
                <input type="number" name="pricePerHousehold" value={formData.plan?.pricePerHousehold} onChange={handleChange} required />
              </div>
              <div className="input-wrapper">
                <label>Currency *</label>
                <select name="currency" value={formData.plan?.currency} onChange={handleChange} required>
                  <option value="">Select Currency</option>
                  <option value="Rupee">₹ Rupee</option>
                  <option value="Dollar">$ Dollar</option>
                </select>
              </div>
            </div>
          )}

          {/* Discount Section */}
          <div className="discount-container">
          <div className="input-wrapper">
            <label>Discount Type</label>
            <select name="discountType" value={formData.discount.type} onChange={handleDiscountTypeChange}>
              <option value="">No Discount</option>
              <option value="fixed">Fixed Price</option>
              <option value="percentage">Percentage</option>
            </select>
            {formData.discount.type && (
              <input type="number" name="discountValue" value={formData.discount.value} onChange={handleChange} required />
            )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={() => navigate('/society')}>Cancel</button>
          </div>
        </form>
    </div>
    </div>
  
  );
};

export default EditSociety;
