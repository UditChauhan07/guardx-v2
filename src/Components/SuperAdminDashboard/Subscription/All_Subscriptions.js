import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import styles from './All_Subscriptions.module.css';

const All_Subscriptions = () => {
    const [moduleTitle, setModuleTitle] = useState('All Subscription');
    const [subscriptions, setSubscriptions] = useState([]);
    const navigate = useNavigate();

    // Fetch subscription plans from API
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch('https://api-kpur6ixuza-uc.a.run.app/api/subscription/all'); 
                const data = await response.json();
                if (Array.isArray(data)) {
                    setSubscriptions(data);
                } else {
                    console.error('Error fetching subscriptions:', data.message);
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        };
        fetchSubscriptions();
    }, []);

    // Helper function to capitalize the first letter
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Handle Delete Subscription Plan
    const handleDelete = async (planId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this plan?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://api-kpur6ixuza-uc.a.run.app/api/subscription/delete/${planId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                alert('Plan deleted successfully');
                setSubscriptions(subscriptions.filter(plan => plan.planId !== planId));
            } else {
                alert(data.message || 'Failed to delete plan');
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Error deleting plan');
        }
    };

    // Handle Sidebar Click
    const handleSidebarClick = (title) => {
        setModuleTitle(title);
    };

    return (
        <div className={styles.container}>
            <Navbar moduleTitle={moduleTitle} />
            <Sidebar onClick={handleSidebarClick} />

            <div className={styles.content}>
                <div className={styles.header}>
                    <button className={styles.addButton} onClick={() => navigate('/add-plan')}>
                        + Add Plan
                    </button>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Price Per Household</th>
                            <th>Interval</th>
                            <th>Currency</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.length > 0 ? (
                            subscriptions.map(plan => (
                                <tr key={plan.planId}>
                                    <td>{plan.planName}</td>
                                    <td>{plan.pricePerHousehold}</td>
                                    <td>{capitalizeFirstLetter(plan.interval)}</td>
                                    <td>{capitalizeFirstLetter(plan.currency)}</td>
                                    <td>
                                        <button 
                                            className={styles.editButton} 
                                            onClick={() => navigate(`/edit/${plan.planId}`)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className={styles.deleteButton} 
                                            onClick={() => handleDelete(plan.planId)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.noData}>No subscription plans found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default All_Subscriptions;
