import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending password reset request for email:', email);
      console.log('Using API URL:', config.apiUrl);

      const response = await axios.post(`${config.apiUrl}/forgot-password`, { email });
      
      console.log('Password reset response:', response.data);
      setSuccess('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (err) {
      console.error('Password reset error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });

      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 404) {
        setError('No account found with this email address.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.error || 'Failed to send reset instructions. Please try again.');
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
              disabled={isLoading}
            />
            <label>Email</label>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !email}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? 'Please wait...' : 'Send Reset Instructions'}
          </button>
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
          padding: 0 10px;
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

export default ForgotPassword;