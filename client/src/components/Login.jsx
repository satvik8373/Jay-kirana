import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import config from '../config';

function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let response;
      if (isSignup) {
        response = await axios.post(`${config.apiUrl}/api/register`, { 
          ...form, 
          name: form.email.split('@')[0] 
        });
        // For signup, wait for the response and then log in
        response = await axios.post(`${config.apiUrl}/api/login`, {
          email: form.email,
          password: form.password
        });
      } else {
        response = await axios.post(`${config.apiUrl}/api/login`, {
          email: form.email,
          password: form.password
        });
      }

      console.log('Login response:', response.data);
      
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      await login(response.data);
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Authentication failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>{isSignup ? 'Create Account' : 'Login Form'}</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-field">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <label>Enter your email</label>
          </div>
          
          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <label>Enter your password</label>
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>

          {!isSignup && (
            <div className="forget">
              <label htmlFor="remember">
                <input
                  type="checkbox"
                  id="remember"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                />
                <p>Remember me</p>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot password?</a>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Log In')}
          </button>

          <div className="register">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(!isSignup); }}>
                {isSignup ? 'Login' : 'Register'}
              </a>
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@200;300;400;500;600;700&display=swap");

        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 40px 10px;
          margin-top: 60px;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }

        .auth-page::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
          backdrop-filter: blur(100px);
          -webkit-backdrop-filter: blur(100px);
          z-index: 0;
          top: 0;
        }

        .wrapper {
          width: 400px;
          border-radius: 15px;
          padding: 40px;
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          margin: 40px auto;
        }

        .wrapper:hover {
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.95);
        }

        form {
          display: flex;
          flex-direction: column;
        }

        h2 {
          font-size: 2.2rem;
          margin-bottom: 25px;
          color: #333333;
          letter-spacing: 1px;
        }

        .input-field {
          position: relative;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
          margin: 25px 0;
        }

        .input-field label {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          color: #666666;
          font-size: 16px;
          pointer-events: none;
          transition: 0.3s ease;
        }

        .input-field input {
          width: 100%;
          height: 45px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 16px;
          color: #333333;
          padding: 0 40px 0 10px;
          transition: all 0.3s ease;
        }

        .input-field input:focus ~ label,
        .input-field input:valid ~ label {
          font-size: 0.9rem;
          top: 10px;
          transform: translateY(-150%);
          color: #1976d2;
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666666;
          transition: color 0.3s ease;
        }

        .password-toggle:hover:not(:disabled) {
          color: #1976d2;
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-toggle svg {
          width: 20px;
          height: 20px;
        }

        .input-field input:focus ~ .password-toggle {
          color: #1976d2;
        }

        .forget {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 25px 0 35px 0;
          color: #666666;
        }

        #remember {
          accent-color: #1976d2;
        }

        .forget label {
          display: flex;
          align-items: center;
        }

        .forget label p {
          margin-left: 8px;
        }

        .wrapper a {
          color: #1976d2;
          text-decoration: none;
          font-weight: 500;
        }

        .wrapper a:hover {
          text-decoration: underline;
        }

        button {
          background-color: #1976d2;
          color: #ffffff;
          font-weight: 600;
          border: none;
          padding: 15px 20px;
          cursor: pointer;
          border-radius: 25px;
          font-size: 16px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        button:hover:not(:disabled) {
          background: #1565c0;
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        button.loading {
          position: relative;
          color: transparent;
        }

        button.loading::after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .register {
          text-align: center;
          margin-top: 30px;
          color: #666666;
        }

        .error-message {
          background: rgba(244, 67, 54, 0.05);
          color: #d32f2f;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid rgba(244, 67, 54, 0.1);
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .auth-page {
            padding: 20px 10px;
            margin-top: 40px;
          }

          .wrapper {
            width: 100%;
            padding: 30px 20px;
            margin: 20px auto;
          }

          h2 {
            font-size: 1.8rem;
          }

          .forget {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;