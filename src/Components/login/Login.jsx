import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../login/Login.css';
import { toast } from 'react-toastify';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // For email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate email/phone and password before submitting
  const validateForm = () => {
    const formErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic international phone format

    if (!identifier) {
      formErrors.identifier = 'Email or phone number is required';
    } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      formErrors.identifier = 'Please enter a valid email or phone number';
    }

    if (!password) {
      formErrors.password = 'Password is required';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      const response = await axios.post('http://localhost:5000/login', {
        identifier, // Can be email or phone
        password,
      });
  
      const user = response.data.user;
  
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(user));
  
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };
  
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper1">
            <label>Email or Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            {errors.identifier && <span className="error">{errors.identifier}</span>}
          </div>

          <div className="input-wrapper1">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
