import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Login.module.css';

const translations = {
  en: {
    loginTitle: "LOGIN",
    emailLabel: "Email",  
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    submitButton: "Submit",
    forgotPassword: "Forgot Password?",
    languageToggle: "English",
  },
  hi: {
    loginTitle: "लॉगिन",
    emailLabel: "ईमेल",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    submitButton: "जमा करें",
    forgotPassword: "पासवर्ड भूल गए?",
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
        const loginTime = new Date().toISOString(); 
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
        if (user.permissions?.guardAccess?.public) {
          navigate('/guard-dashboard'); 
        } else {
          navigate('/dashboard'); 
        } 
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.languageSwitch}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            onChange={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.languageLabel}>{translations[language].languageToggle}</span>
      </div>

      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>{translations[language].loginTitle}</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputWrapper}>
            <label>{translations[language].emailLabel}</label>
            <div className={styles.passwordWrapper}>
            <input
              type="email"
              placeholder={translations[language].emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label>{translations[language].passwordLabel}</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={translations[language].passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          {/* Forgot Password Link */}
          <div className={styles.forgotPassword}>
            <span onClick={() => navigate('/forgot-password')}>
              {translations[language].forgotPassword}
            </span>
          </div>
          <button type="submit" className={styles.submitButton}>
            {translations[language].submitButton}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
