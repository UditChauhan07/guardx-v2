import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const requestResetCode = async () => {
    try {
      await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/forgot-password', { email });
      toast.success('Reset code sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset code');
    }
  };

  const verifyCode = async () => {
    try {
      await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/verify-reset-code', { email, code });
      toast.success('Code verified! Set a new password');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid reset code');
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/reset-password', { email, code, newPassword });
      toast.success('Password reset successful! Please login.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>🔒 Reset Password</h2>
        
        {step === 1 && (
          <>
            <p>Enter your email to receive a reset code.</p>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <button onClick={requestResetCode}>Send Code</button>
          </>
        )}

        {step === 2 && (
          <>
            <p>Enter the reset code sent to your email.</p>
            <input 
              type="text" 
              placeholder="Enter reset code" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              required 
            />
            <button onClick={verifyCode}>Verify Code</button>
          </>
        )}

        {step === 3 && (
          <>
            <p>Set a new password for your account.</p>
            <input 
              type="password" 
              placeholder="Enter new password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <button onClick={resetPassword}>Change Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
