import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [packs, setPacks] = useState([]);
  const [newPack, setNewPack] = useState({ quantity: '', price: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  const handlePackChange = (e) => {
    const { name, value } = e.target;
    setNewPack(prev => ({ ...prev, [name]: value }));
  };

  const addPack = () => {
    if (!newPack.quantity || !newPack.price) {
      setError('Both quantity and price are required for packs');
      return;
    }
    setPacks([...packs, { ...newPack }]);
    setNewPack({ quantity: '', price: '' });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post(`${config.apiUrl}/api/products`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        setFormData({
          name: '',
          category: '',
          price: '',
          stock: '',
          image: null
        });
        setSuccess('Product added successfully');
        setPacks([]);
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product: ' + (err.response?.data?.error || err.message));
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await axios.post(`${config.apiUrl}/api/categories`, {
        name: newCategory
      });
      if (response.status === 201) {
        setCategories([...categories, response.data]);
        setNewCategory('');
        setSuccess('Category added successfully');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category: ' + (err.response?.data?.error || err.message));
      setSuccess(null);
    }
  };

  const updateCategory = async (id, name) => {
    try {
      const response = await axios.put(`${config.apiUrl}/api/categories/${id}`, {
        name
      });
      if (response.status === 200) {
        setCategories(categories.map(cat =>
          cat._id === id ? { ...cat, name } : cat
        ));
        setEditingCategory(null);
        setSuccess('Category updated successfully');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category: ' + (err.response?.data?.error || err.message));
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await axios.delete(`${config.apiUrl}/api/categories/${id}`);
        if (response.status === 200) {
          setCategories(categories.filter(cat => cat._id !== id));
          setSuccess('Category deleted successfully');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Failed to delete category: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-grid">
        {/* Product Form Section */}
        <div className="product-section">
          <h2>Add New Product</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                name="image"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, image: reader.result }));
                      setImagePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}

            <div className="form-group">
              <label>Add Pack</label>
              <div className="pack-input">
                <input
                  type="text"
                  name="quantity"
                  value={newPack.quantity}
                  onChange={handlePackChange}
                  placeholder="Enter quantity (kg, g, etc.)"
                />
                <input
                  type="number"
                  name="price"
                  value={newPack.price}
                  onChange={handlePackChange}
                  placeholder="Enter price"
                />
                <button type="button" onClick={addPack} className="add-pack-btn">Add Pack</button>
              </div>
            </div>

            <div className="packs-list">
              {packs.map((pack, index) => (
                <div key={index} className="pack-item">
                  {pack.quantity} - ₹{pack.price}
                </div>
              ))}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Category Management Section */}
        <div className="category-section">
          <h2>Manage Categories</h2>
          
          <div className="add-category">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
            />
            <button onClick={addCategory}>
              <FaPlus /> Add
            </button>
          </div>

          <div className="categories-list">
            {categories.map(category => (
              <div key={category._id} className="category-item">
                {editingCategory === category._id ? (
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => {
                      const updatedCategories = categories.map(cat =>
                        cat._id === category._id ? { ...cat, name: e.target.value } : cat
                      );
                      setCategories(updatedCategories);
                    }}
                    onBlur={() => updateCategory(category._id, category.name)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateCategory(category._id, category.name);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{category.name}</span>
                    <div className="category-actions">
                      <button onClick={() => setEditingCategory(category._id)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteCategory(category._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 2rem;
        }

        .product-section, .category-section {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #1a237e;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .product-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          color: #333;
          font-weight: 500;
        }

        input, select {
          padding: 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input:focus, select:focus {
          border-color: #1a237e;
          box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
        }

        .image-preview {
          margin-top: 1rem;
          border-radius: 5px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
        }

        .submit-btn {
          background: #1a237e;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #283593;
        }

        .submit-btn:disabled {
          background: #9fa8da;
          cursor: not-allowed;
        }

        .add-category {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .add-category input {
          flex: 1;
        }

        .add-category button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f5f5f5;
          border-radius: 5px;
        }

        .category-actions {
          display: flex;
          gap: 0.5rem;
        }

        .category-actions button {
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          color: #666;
          transition: color 0.3s ease;
        }

        .category-actions button:hover {
          color: #1a237e;
        }

        .error-message, .success-message {
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1rem;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
        }

        .success-message {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #c8e6c9;
        }

        .pack-input {
          display: flex;
          gap: 1rem;
        }

        .add-pack-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .packs-list {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .pack-item {
          padding: 0.75rem;
          background: #f5f5f5;
          border-radius: 5px;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .admin-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AddProduct; 