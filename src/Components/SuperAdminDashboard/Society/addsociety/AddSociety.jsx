import React, { useEffect, useState } from 'react';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import './AddSociety.css';
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const AddSociety = () => {
  const [moduleTitle, setModuleTitle] = useState('Add Society');
  const [plans, setPlans] = useState([]); 
  const [filteredPlans, setFilteredPlans] = useState([]); 

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

  // Fetch all plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('https://api-kpur6ixuza-uc.a.run.app/api/subscription/all');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 // Handle house range selection
 const handleHouseRangeChange = (e) => {
  const houseRange = e.target.value;
  setFormData(prev => ({
    ...prev,
    houseRange,
    plan: { planName: '', interval: '', pricePerHousehold: '', currency: '' }
  }));

  // Filter plans by house range
  const filtered = plans.filter(plan => plan.houseRange === houseRange);
  setFilteredPlans(filtered);

  // Auto-select the first plan from the filtered list
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
  // Handle plan selection
  const handlePlanChange = (e) => {
    const selectedPlanName = e.target.value;
    
    if (selectedPlanName === 'Custom') {
      setFormData(prev => ({
        ...prev,
        plan: { planName: 'Custom', interval: '', pricePerHousehold: '', currency: '' }
      }));
    } else {
      const selectedPlan = plans.find(plan => plan.planName === selectedPlanName);
      setFormData(prev => ({
        ...prev,
        plan: selectedPlan ? { ...selectedPlan } : { planName: '', interval: '', pricePerHousehold: '', currency: '' }
      }));
    }
  };
  // Handle interval selection
  const handleIntervalChange = (e) => {
    setFormData(prev => ({
      ...prev,
      plan: { ...prev.plan, interval: e.target.value }
    }));
  };

  // Handle discount type selection
  const handleDiscountTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      discount: { type: e.target.value, value: '' }
    }));
  };

 // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/add-society', formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    toast.success('Society added successfully!');
    navigate('/society');
  } catch (error) {
    const errorMessage =
      error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'An unexpected error occurred. Please try again.';

    toast.warning(errorMessage);
  }
};

  const handleSidebarClick = (title) => {
    setModuleTitle(title);
  };
const navigate = useNavigate();

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
             {/* House Range Selection */}
          <div className="input-wrapper2">
            <label>House Range <span className="required">*</span></label>
            <select name="houseRange" value={formData.houseRange} onChange={handleHouseRangeChange} required>
              <option value="">Select House Range</option>
              <option value="0-250">0-250</option>
              <option value="250-500">250-500</option>
              <option value="500+">500+</option>
            </select>
          </div>
          </div>
          <div className='plan'>
     {/* Plan Selection - Show only plan name */}
     {formData.houseRange && (
            <div className="input-wrapper2">
              <label>Plan Name <span className="required">*</span></label>
              <select name="planName" value={formData.plan.planName} onChange={handlePlanChange} required>
                {plans.map(plan => (
                  <option key={plan.planName} value={plan.planName}>
                    {plan.planName}
                  </option>
                ))}
                <option value="Custom">Custom Plan</option>
              </select>
            </div>
          )}
            {/* Interval Selection */}
          {formData.plan.planName && formData.plan.planName !== 'Custom' && (
            <div className="input-wrapper2">
              <label>Interval <span className="required">*</span></label>
              <select name="interval" value={formData.plan.interval} onChange={handleIntervalChange} required>
              <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
          )}
          </div>
          {/* Custom Plan Inputs */}
          {formData.plan.planName === 'Custom' && (
            <>
              <div className="form-row">
                <div className="input-wrapper2">
                  <label>Interval <span className="required">*</span></label>
                  <select name="interval" onChange={(e) => setFormData(prev => ({ ...prev, plan: { ...prev.plan, interval: e.target.value } }))} required>
                  
                    <option value="">Select Interval</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>

                  </select>
                </div>
                <div className="input-wrapper2">
                  <label>Price Per Household <span className="required">*</span></label>
                  <input type="number" onChange={(e) => setFormData(prev => ({ ...prev, plan: { ...prev.plan, pricePerHousehold: e.target.value } }))} required />
                </div>
              </div>
              <div className='currency'></div>
              <div className="input-wrapper2">
                <label>Currency <span className="required">*</span></label>
                <select name="currency" onChange={(e) => setFormData(prev => ({ ...prev, plan: { ...prev.plan, currency: e.target.value } }))} required>
                  <option value="">Select Currency</option>
                  <option value="Rupee">₹ Rupee</option>
                  <option value="Dollar">$ Dollar</option>
                </select>
              </div>
        
            </>
          )}

          {/* Discount Selection */}
          <div className='discount'>
          <div className="input-wrapper3">
            <label>Discount Type</label>
            <select name="discountType" onChange={handleDiscountTypeChange}>
              <option value="">No Discount</option>
              <option value="fixed">Fixed Price</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          {formData.discount.type && (
            <div className="input-wrapper3">
              <label>Discount Value <span className="required">*</span></label>
              <input type="number" name="discountValue" onChange={(e) => setFormData(prev => ({ ...prev, discount: { ...prev.discount, value: e.target.value } }))} required />
            </div>
          )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="save-button1">Save</button>
            <button type="button" className="cancel-button1" onClick={() => navigate('/society')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSociety;
