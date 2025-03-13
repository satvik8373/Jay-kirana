import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid reset token');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        const response = await axios.get(`${config.apiUrl}/verify-reset-token/${token}`);
        if (response.data.valid) {
          setIsTokenValid(true);
        } else {
          setError('Invalid or expired reset token');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setError('Invalid or expired reset token');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTokenValid) {
      setError('Invalid or expired reset token');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending reset password request with token:', token);
      const response = await axios.post(`${config.apiUrl}/reset-password`, {
        token,
        newPassword: password
      });

      console.log('Reset password response:', response);

      if (response.status === 200) {
        setSuccess('Password reset successful. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'Invalid or expired reset token');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check if the server is running.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <label>New Password</label>
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
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

          <div className="input-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <label>Confirm Password</label>
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
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

          <button 
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? 'Please wait...' : 'Reset Password'}
          </button>

          <div className="register">
            <p>
              Remember your password?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@200;300;400;500;600;700&display=swap");

        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 120px 10px 40px;
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
          margin: 20px auto;
        }

        .wrapper:hover {
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.95);
        }

        h2 {
          font-size: 2.2rem;
          margin-bottom: 25px;
          color: #333333;
          letter-spacing: 1px;
        }

        .success-message {
          background-color: #4caf50;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
        }

        .error-message {
          background-color: #f44336;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(244, 67, 54, 0.2);
        }

        .input-field {
          position: relative;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
          margin: 25px 0;
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

        .input-field input:focus ~ label,
        .input-field input:valid ~ label {
          font-size: 0.9rem;
          top: 10px;
          transform: translateY(-150%);
          color: #1976d2;
          font-weight: 500;
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

        button[type="submit"] {
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
          width: 100%;
          margin-top: 30px;
        }

        button[type="submit"]:hover:not(:disabled) {
          background: #1565c0;
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
          transform: translateY(-1px);
        }

        button[type="submit"]:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background-color: #ccc;
        }

        .loading {
          position: relative;
          color: transparent !important;
        }

        .loading::after {
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
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .register {
          margin-top: 25px;
          color: #666666;
        }

        .register a {
          color: #1976d2;
          text-decoration: none;
          font-weight: 500;
          margin-left: 5px;
          transition: all 0.3s ease;
        }

        .register a:hover {
          text-decoration: underline;
          color: #1565c0;
        }

        @media (max-width: 480px) {
          .wrapper {
            width: 100%;
            padding: 30px 20px;
          }

          h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ResetPassword; 