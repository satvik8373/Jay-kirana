import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
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
      const response = await axios.get(`${config.apiUrl}/api/categories`, {
        withCredentials: true
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (name === 'image' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
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
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${config.apiUrl}/api/products`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      toast.success('Product added successfully!');
      navigate('/admin/manage-products');
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
                required
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

            <button type="submit" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
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