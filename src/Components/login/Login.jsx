import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../login/Login.css';

const translations = {
  en: {
    loginTitle: "LOGIN",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    submitButton: "Submit",
    languageToggle: "English",
  },
  hi: {
    loginTitle: "लॉगिन",
    emailLabel: "ईमेल",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    submitButton: "जमा करें",
    languageToggle: "हिंदी",
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('https://api-kpur6ixuza-uc.a.run.app/login', { email, password });
  
      if (response.data.user) {
        const user = response.data.user;
        const loginTime = new Date().toISOString(); // Get current date & time in ISO format
  
        // Save user details in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          name: user.name || '',
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          permissions: user.permissions || {},
          societyId: user.societyId || '',
          loginTime,
        }));
  
        toast.success('Login successful!');
  
        // 🔹 **Save Attendance Record**
        await axios.post('https://api-kpur6ixuza-uc.a.run.app/api/attendance/login', {
          userId: user.id,
          email: user.email,
          name: user.name || '',
          societyId: user.societyId || '',
        }).then(() => {
          console.log("✅ Attendance recorded successfully");
        }).catch((err) => {
          console.error("⚠️ Error recording attendance:", err);
        });
  
        // 🔹 **Navigate Based on Permissions**
        if (user.permissions?.guardAccess?.public) {
          navigate('/guard-dashboard'); 
        } else {
          navigate('/dashboard'); // 🚀 Redirect to Main Dashboard
        } 
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };
  return (
    <div className="login-container">
      <div className="language-switch">
        <label className="switch">
          <input
            type="checkbox"
            onChange={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          />
          <span className="slider round"></span>
        </label>
        <span className="language-label">{translations[language].languageToggle}</span>
      </div>

      <div className="login-card">
        <h2 className="login-title">{translations[language].loginTitle}</h2>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <label>{translations[language].emailLabel}</label>
            <input
              type="email"
              placeholder={translations[language].emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <label>{translations[language].passwordLabel}</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={translations[language].passwordPlaceholder}
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
          </div>

          <button type="submit" className="submit-button0">
            {translations[language].submitButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
