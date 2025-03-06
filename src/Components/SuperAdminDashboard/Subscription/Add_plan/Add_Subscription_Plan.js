import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../sidebar/Sidebar';
import styles from './Add_Subscription_Plan.module.css';
import { toast } from 'react-toastify';

const Add_Subscription_Plan = () => {
    const [moduleTitle, setModuleTitle] = useState('Add Subscription');
    const [planName, setPlanName] = useState('');
    const [pricePerHousehold, setPricePerHousehold] = useState('');
    const [houseRange, setHouseRange] = useState('');
    const [interval, setInterval] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('');
    const navigate = useNavigate();

    // Handle Sidebar Click
    const handleSidebarClick = (title) => {
        setModuleTitle(title);
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!planName || !pricePerHousehold || !houseRange || !interval || !currency) {
            alert("Please fill all required fields.");
            return;
        }

        const newPlan = {
            planName,
            pricePerHousehold: parseFloat(pricePerHousehold),
            houseRange,
            interval,
            description,
            currency
        };

        try {
            const response = await fetch('https://api-kpur6ixuza-uc.a.run.app/api/subscription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPlan)
            });

            const data = await response.json();
            if (response.ok) {
                toast("Subscription Plan Added Successfully!");
                navigate('/subscription'); 
            } else {
                alert(data.message || "Failed to add subscription plan.");
            }
        } catch (error) {
            console.error("Error adding subscription plan:", error);
            alert("Error adding subscription plan");
        }
    };

    return (
        <div className={styles.container}>
            <Navbar moduleTitle={moduleTitle} />
            <Sidebar onClick={handleSidebarClick} />

            <div className={styles.formContainer}>
                <h2>Add Subscription Plan</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Plan Name:</label>
                        <select value={planName} onChange={(e) => setPlanName(e.target.value)} required>
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
                            value={pricePerHousehold}
                            onChange={(e) => setPricePerHousehold(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>No. of Houses in Society:</label>
                        <select value={houseRange} onChange={(e) => setHouseRange(e.target.value)} required>
                            <option value="">Select Range</option>
                            <option value="0-250">0-250</option>
                            <option value="250-500">250-500</option>
                            <option value="500+">500+</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Interval:</label>
                        <select value={interval} onChange={(e) => setInterval(e.target.value)} required>
                            <option value="">Select Interval</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        ></textarea>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Payment Currency:</label>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} required>
                            <option value="">Select Currency</option>
                            <option value="rupee">₹ Rupee</option>
                            <option value="dollar">$ Dollar</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.submitButton}>Add Plan</button>
                </form>
            </div>
        </div>
    );
};

export default Add_Subscription_Plan;
