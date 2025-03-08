import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">
            <span className="title-text">Jay Kirana</span>
            <span className="title-fresh">Fresh</span>
          </h3>
          <p className="footer-description">
            Your trusted partner for fresh groceries and daily essentials delivered right to your doorstep.
          </p>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <p><FaPhone className="contact-icon" /> +1-123-456-7890</p>
            <p><FaEnvelope className="contact-icon" /> info@jaykirana.com</p>
            <p><FaMapMarkerAlt className="contact-icon" /> 123 Fresh Market Street</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Jay Kirana. All rights reserved.</p>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(to right, #1a237e, #283593);
          color: white;
          padding: 4rem 2rem 1rem;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #90caf9, #1976d2);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          padding: 0 1rem;
        }

        .footer-section {
          animation: fadeIn 0.5s ease-out;
          padding: 1rem;
        }

        .footer-title {
          font-size: clamp(1.5rem, 2.5vw, 1.8rem);
          margin-bottom: 1rem;
          display: flex;
          gap: 5px;
        }

        .title-text {
          color: #90caf9;
        }

        .title-fresh {
          color: white;
        }

        .footer-description {
          color: #e3f2fd;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: clamp(0.9rem, 1.5vw, 1rem);
        }

        .social-links {
          display: flex;
          gap: clamp(0.5rem, 2vw, 1rem);
          flex-wrap: wrap;
        }

        .social-link {
          color: white;
          font-size: clamp(1rem, 2vw, 1.2rem);
          padding: clamp(6px, 1.5vw, 8px);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-link:hover {
          background: #1976d2;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
        }

        h4 {
          color: #90caf9;
          font-size: clamp(1rem, 2vw, 1.2rem);
          margin-bottom: 1.5rem;
          position: relative;
        }

        h4::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 2px;
          background: #1976d2;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: clamp(0.6rem, 1.5vw, 0.8rem);
        }

        .footer-links a {
          color: #e3f2fd;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          font-size: clamp(0.9rem, 1.5vw, 1rem);
        }

        .footer-links a:hover {
          color: #90caf9;
          transform: translateX(5px);
        }

        .contact-info p {
          display: flex;
          align-items: center;
          margin-bottom: clamp(0.8rem, 1.5vw, 1rem);
          color: #e3f2fd;
          font-size: clamp(0.9rem, 1.5vw, 1rem);
        }

        .contact-icon {
          margin-right: 10px;
          color: #90caf9;
          font-size: clamp(1rem, 2vw, 1.2rem);
        }

        .footer-bottom {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: clamp(0.8rem, 1.5vw, 0.9rem);
          color: #e3f2fd;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile styles */
        @media (max-width: 480px) {
          .footer {
            padding: 2rem 1rem 1rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .footer-section {
            text-align: center;
            padding: 0.5rem;
          }

          .social-links {
            justify-content: center;
          }

          h4::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .contact-info p {
            justify-content: center;
          }
        }

        /* Tablet styles */
        @media (min-width: 481px) and (max-width: 768px) {
          .footer {
            padding: 3rem 1.5rem 1rem;
          }

          .footer-content {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-section:first-child {
            grid-column: 1 / -1;
            text-align: center;
          }

          .social-links {
            justify-content: center;
          }
        }

        /* Large screens */
        @media (min-width: 1200px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;