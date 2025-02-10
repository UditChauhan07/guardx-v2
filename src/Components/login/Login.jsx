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
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Login successful!');
      navigate('/dashboard'); 
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };
  console.log (process.env.REACT_APP_FIREBASE_API_KEY);

  return (
    <div className="login-container">
      {/* Language Toggle Switch */}
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
          { process.env.API_KEY}
        </form>
      </div>
    </div>
  );
};

export default Login;
