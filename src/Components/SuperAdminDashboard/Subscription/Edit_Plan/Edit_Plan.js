import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import styles from './Edit_Plan.module.css';
import { toast } from 'react-toastify';

const Edit_Plan = () => {
    const [moduleTitle, setModuleTitle] = useState('Edit Subscription');
    const { planId } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState({
        planName: '',
        pricePerHousehold: '',
        houseRange: '',
        interval: '',
        description: '',
        currency: ''
    });

    // Fetch existing plan details
    useEffect(() => {
        const fetchPlanDetails = async () => {
            try {
                const response = await fetch(`https://api-kpur6ixuza-uc.a.run.app

/api/subscription/${planId}`);
                const data = await response.json();
                if (response.ok) {
                    setPlan(data);
                } else {
                    console.error('Error fetching plan:', data.message);
                }
            } catch (error) {
                console.error('Error fetching plan:', error);
            }
        };
        fetchPlanDetails();
    }, [planId]);

    // Handle Sidebar Click
    const handleSidebarClick = (title) => {
        setModuleTitle(title);
    };

    // Handle Form Input Changes
    const handleChange = (e) => {
        setPlan({ ...plan, [e.target.name]: e.target.value });
    };

    // Handle Plan Update
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://api-kpur6ixuza-uc.a.run.app

/api/subscription/edit/${planId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(plan)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Subscription Plan Updated Successfully!');
                navigate('/subscription'); 
            } else {
                alert(data.message || 'Failed to update subscription plan.');
            }
        } catch (error) {
            console.error('Error updating plan:', error);
            alert('Error updating plan');
        }
    };

    return (
        <div className={styles.container}>
            <Navbar moduleTitle={moduleTitle} />
            <Sidebar onClick={handleSidebarClick} />

            <div className={styles.formContainer}>
                <h2>Edit Subscription Plan</h2>
                <form onSubmit={handleUpdate} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Plan Name:</label>
                        <select name="planName" value={plan.planName} onChange={handleChange} required>
                            <option value="">Select Plan</option>
                            <option value="Standard">Standard</option>
                            <option value="Elite">Elite</option>
                            <option value="Supreme">Supreme</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Price Per Household:</label>
                        <input
                            type="number"
                            name="pricePerHousehold"
                            value={plan.pricePerHousehold}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>No. of Houses in Society:</label>
                        <select name="houseRange" value={plan.houseRange} onChange={handleChange} required>
                            <option value="">Select Range</option>
                            <option value="0-250">0-250</option>
                            <option value="250-500">250-500</option>
                            <option value="500+">500+</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Interval:</label>
                        <select name="interval" value={plan.interval} onChange={handleChange} required>
                            <option value="">Select Interval</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={plan.description}
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Payment Currency:</label>
                        <select name="currency" value={plan.currency} onChange={handleChange} required>
                            <option value="">Select Currency</option>
                            <option value="rupee">₹ Rupee</option>
                            <option value="dollar">$ Dollar</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.submitButton}>Update Plan</button>
                </form>
            </div>
        </div>
    );
};

export default Edit_Plan;
