import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { FaEnvelope, FaUsers, FaTags, FaSpinner, FaCheck, FaTimes, FaImage, FaFont, FaPalette, FaAlignLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function EmailMarketing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    discountCode: '',
    discountPercentage: '',
    productIds: [],
    cardStyle: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      headerColor: '#1976d2',
      fontFamily: 'Arial, sans-serif',
      imageUrl: '',
      alignment: 'left'
    }
  });
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Template options
  const emailTemplates = [
    {
      name: 'Welcome Offer',
      subject: 'Welcome to Jay Kirana - Special Offer Inside! 🌟',
      content: `We're delighted to have you as part of the Jay Kirana family!

To celebrate your arrival, we've prepared a special welcome offer just for you. Explore our fresh selection of groceries and household essentials, all delivered right to your doorstep.

Don't forget to use your exclusive discount code below for savings on your first purchase!`,
      style: {
        backgroundColor: '#f8f9fa',
        headerColor: '#2e7d32',
        textColor: '#2c3e50'
      }
    },
    {
      name: 'Seasonal Sale',
      subject: 'Seasonal Savings at Jay Kirana! 🍂',
      content: `Get ready for amazing deals on seasonal favorites!

We've stocked up on fresh produce, pantry essentials, and household items at incredible prices. Don't miss out on these limited-time offers.

Browse our featured products below and enjoy special discounts on your purchase.`,
      style: {
        backgroundColor: '#fff3e0',
        headerColor: '#e65100',
        textColor: '#33691e'
      }
    },
    {
      name: 'Festival Special',
      subject: 'Celebrate with Jay Kirana - Festival Special Offers! 🪔',
      content: `The festival season is here, and we're celebrating with special offers just for you!

Stock up on all your festival essentials with our curated selection of products. From traditional ingredients to modern conveniences, we've got everything you need for the perfect celebration.

Check out our festive deals and exclusive discounts below!`,
      style: {
        backgroundColor: '#fce4ec',
        headerColor: '#c2185b',
        textColor: '#4a148c'
      }
    }
  ];

  // Fetch customers and products when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access this feature');
          navigate('/login');
          return;
        }

        const [customersRes, productsRes] = await Promise.all([
          axios.get(`${config.apiUrl}/users/all`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${config.apiUrl}/products`)
        ]);

        if (customersRes.data) {
          setCustomers(customersRes.data);
        }
        setProducts(productsRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized access. Please log in again.');
          navigate('/login');
        } else if (err.response?.status === 403) {
          setError('Access forbidden. Admin privileges required.');
        } else {
          setError('Failed to load data. Please try again later.');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('customerIds', JSON.stringify(selectedCustomers));
      formData.append('subject', emailData.subject);
      formData.append('content', emailData.content);
      formData.append('discountCode', emailData.discountCode);
      formData.append('discountPercentage', emailData.discountPercentage);
      formData.append('products', JSON.stringify(selectedProducts));
      formData.append('cardStyle', JSON.stringify(emailData.cardStyle));

      if (emailData.cardStyle.imageFile) {
        formData.append('image', emailData.cardStyle.imageFile);
      }

      const response = await axios.post(
        `${config.apiUrl}/admin/send-marketing-email`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess('Marketing emails sent successfully!');
      // Reset form
      setEmailData({
        subject: '',
        content: '',
        discountCode: '',
        discountPercentage: '',
        productIds: [],
        cardStyle: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          headerColor: '#1976d2',
          fontFamily: 'Arial, sans-serif',
          imageUrl: '',
          alignment: 'left'
        }
      });
      setSelectedCustomers([]);
      setSelectedProducts([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send marketing emails');
      console.error('Error sending marketing emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllCustomers = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(customer => customer._id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmailData(prev => ({
          ...prev,
          cardStyle: {
            ...prev.cardStyle,
            imageUrl: reader.result,
            imageFile: file
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template) => {
    setEmailData(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      cardStyle: {
        ...prev.cardStyle,
        ...template.style
      }
    }));
  };

  const EmailPreview = () => (
    <div 
      style={{
        backgroundColor: emailData.cardStyle.backgroundColor,
        color: emailData.cardStyle.textColor,
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '20px auto',
        fontFamily: emailData.cardStyle.fontFamily,
        textAlign: emailData.cardStyle.alignment
      }}
    >
      <div style={{ backgroundColor: emailData.cardStyle.headerColor, padding: '20px', borderRadius: '8px 8px 0 0', marginBottom: '20px' }}>
        <h2 style={{ color: '#ffffff', margin: 0 }}>{emailData.subject}</h2>
      </div>
      
      {emailData.cardStyle.imageUrl && (
        <img 
          src={emailData.cardStyle.imageUrl} 
          alt="Email header" 
          style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
        />
      )}
      
      <div style={{ whiteSpace: 'pre-line' }}>
        {emailData.content}
      </div>
      
      {selectedProducts.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Featured Products</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {products
              .filter(product => selectedProducts.includes(product._id))
              .map(product => (
                <div key={product._id} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {emailData.discountCode && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
          <h3>Special Offer</h3>
          <p>Use code <strong>{emailData.discountCode}</strong> to get {emailData.discountPercentage}% off!</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="email-marketing-container">
      <div className="marketing-header">
        <h2><FaEnvelope /> Email Marketing</h2>
        <p>Create and send professional marketing emails to your customers</p>
      </div>

      {error && (
        <div className="error-message">
          <FaTimes /> {error}
          <button className="dismiss-button" onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <FaCheck /> {success}
          <button className="dismiss-button" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div className="template-section">
        <h3>Email Templates</h3>
        <div className="template-grid">
          {emailTemplates.map((template, index) => (
            <button
              key={index}
              className="template-button"
              onClick={() => handleTemplateSelect(template)}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3><FaUsers /> Select Customers</h3>
          <div className="select-all">
            <label>
              <input
                type="checkbox"
                checked={selectedCustomers.length === customers.length}
                onChange={handleSelectAllCustomers}
              />
              Select All Customers
            </label>
          </div>
          <div className="customers-grid">
            {customers.map(customer => (
              <label key={customer._id} className="customer-item">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer._id)}
                  onChange={() => {
                    setSelectedCustomers(prev =>
                      prev.includes(customer._id)
                        ? prev.filter(id => id !== customer._id)
                        : [...prev, customer._id]
                    );
                  }}
                />
                {customer.name} ({customer.email})
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3><FaTags /> Email Design</h3>
          <div className="design-controls">
            <div className="form-group">
              <label><FaFont /> Font Family</label>
              <select
                value={emailData.cardStyle.fontFamily}
                onChange={(e) => setEmailData(prev => ({
                  ...prev,
                  cardStyle: { ...prev.cardStyle, fontFamily: e.target.value }
                }))}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </select>
            </div>

            <div className="form-group">
              <label><FaPalette /> Colors</label>
              <div className="color-inputs">
                <div>
                  <span>Background</span>
                  <input
                    type="color"
                    value={emailData.cardStyle.backgroundColor}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      cardStyle: { ...prev.cardStyle, backgroundColor: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <span>Text</span>
                  <input
                    type="color"
                    value={emailData.cardStyle.textColor}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      cardStyle: { ...prev.cardStyle, textColor: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <span>Header</span>
                  <input
                    type="color"
                    value={emailData.cardStyle.headerColor}
                    onChange={(e) => setEmailData(prev => ({
                      ...prev,
                      cardStyle: { ...prev.cardStyle, headerColor: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label><FaAlignLeft /> Text Alignment</label>
              <select
                value={emailData.cardStyle.alignment}
                onChange={(e) => setEmailData(prev => ({
                  ...prev,
                  cardStyle: { ...prev.cardStyle, alignment: e.target.value }
                }))}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="form-group">
              <label><FaImage /> Header Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              required
              placeholder="Enter email subject"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={emailData.content}
              onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
              required
              rows="6"
              placeholder="Enter email content"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Discount Information</h3>
          <div className="discount-grid">
            <div className="form-group">
              <label>Discount Code</label>
              <input
                type="text"
                value={emailData.discountCode}
                onChange={(e) => setEmailData({ ...emailData, discountCode: e.target.value })}
                placeholder="Enter discount code"
              />
            </div>

            <div className="form-group">
              <label>Discount Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                value={emailData.discountPercentage}
                onChange={(e) => setEmailData({ ...emailData, discountPercentage: e.target.value })}
                placeholder="Enter discount percentage"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Featured Products</h3>
          <div className="products-grid">
            {products.map(product => (
              <label key={product._id} className="product-item">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={() => {
                    setSelectedProducts(prev =>
                      prev.includes(product._id)
                        ? prev.filter(id => id !== product._id)
                        : [...prev, product._id]
                    );
                  }}
                />
                {product.name} (₹{product.price})
              </label>
            ))}
          </div>
        </div>

        <div className="preview-toggle">
          <button type="button" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {previewMode && <EmailPreview />}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? <><FaSpinner className="spinner" /> Sending...</> : 'Send Marketing Emails'}
        </button>
      </form>

      <style jsx>{`
        .email-marketing-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .marketing-header {
          margin-bottom: 32px;
        }

        .marketing-header h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1a237e;
          margin: 0;
          font-size: 24px;
        }

        .marketing-header p {
          color: #666;
          margin: 8px 0 0;
        }

        .template-section {
          margin-bottom: 24px;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .template-button {
          padding: 12px;
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .template-button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        .form-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .form-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px;
          color: #1a237e;
        }

        .design-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .color-inputs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .color-inputs div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .color-inputs span {
          font-size: 12px;
          color: #666;
        }

        .file-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .preview-toggle {
          margin-bottom: 24px;
          text-align: center;
        }

        .preview-toggle button {
          padding: 8px 16px;
          background: #f5f5f5;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .preview-toggle button:hover {
          background: #e0e0e0;
        }

        .customers-grid,
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .customer-item,
        .product-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          background: #f5f5f5;
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #1a237e;
          font-weight: 500;
        }

        input[type="text"],
        input[type="number"],
        textarea,
        select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #1976d2;
          outline: none;
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }

        .discount-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .submit-button:hover {
          background: #1565c0;
          transform: translateY(-2px);
        }

        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-message,
        .success-message {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
        }

        .success-message {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .dismiss-button {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
        }

        @media (max-width: 768px) {
          .email-marketing-container {
            padding: 16px;
          }

          .customers-grid,
          .products-grid,
          .design-controls {
            grid-template-columns: 1fr;
          }

          .discount-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default EmailMarketing; 