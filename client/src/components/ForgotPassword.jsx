import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending password reset request for email:', email);
      console.log('API URL:', config.apiUrl);
      
      const response = await axios.post(`${config.apiUrl}/auth/forgot-password`, 
        { 
          email,
          resetUrl: 'https://jay-kirana.onrender.com/reset-password' // Base URL for reset password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Password reset response:', response.data);
      setSuccess('Password reset instructions have been sent to your email.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 404) {
        setError('No account found with this email address.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Please provide a valid email address.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response?.status === 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(err.response?.data?.error || 'Failed to process password reset request. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="input-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Enter your email</label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
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

      <style jsx>{`
        .success-message {
          background-color: #4caf50;
          color: white;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .error-message {
          background-color: #f44336;
          color: white;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        /* Inheriting existing styles from Login component */
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

        .input-field {
          position: relative;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
          margin: 20px 0;
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
          height: 40px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 16px;  
          color: #333333;
          padding: 0 10px;
        }

        .input-field input:focus ~ label,
        .input-field input:valid ~ label {
          font-size: 0.9rem;
          top: 10px;
          transform: translateY(-150%);
          color: #1976d2;
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
          margin-top: 20px;
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

        .register {
          margin-top: 20px;
        }

        a {
          color: #1976d2;
          text-decoration: none;
          font-weight: 500;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;