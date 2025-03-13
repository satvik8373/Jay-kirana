import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import config from '../../config';

// Configure axios with base URL
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

function AddProduct() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
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
      console.log('Fetching categories...');
      const response = await api.get('/api/categories');
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
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

  const addProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
        setError('All fields are required');
        return;
      }

      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        image: newProduct.image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        packs
      };

      const response = await api.post('/api/products', productData);
      setSuccess('Product added successfully');
      setNewProduct({ name: '', category: '', price: '', stock: '', image: '' });
      setPacks([]);
      setImagePreview(null);
    } catch (err) {
      console.error('Error adding product:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      console.log('Attempting to add category:', newCategory);
      const response = await api.post('/api/categories', { name: newCategory });
      console.log('Category added successfully:', response.data);
      setCategories([...categories, response.data]);
      setNewCategory('');
      setSuccess('Category added successfully');
      setError(null);
    } catch (err) {
      console.error('Error adding category:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Failed to add category');
      setSuccess(null);
    }
  };

  const updateCategory = async (id, newName) => {
    try {
      const response = await api.put(`/api/categories/${id}`, { name: newName });
      const updatedCategories = categories.map(cat => 
        cat._id === id ? response.data : cat
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
      setSuccess('Category updated successfully');
    } catch (err) {
      console.error('Error updating category:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Failed to update category');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      setSuccess('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.error || 'Failed to delete category');
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

          <form onSubmit={addProduct} className="product-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={newProduct.category}
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
                  value={newProduct.price}
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
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <div className="image-input">
                <input
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
                <FaImage className="image-icon" />
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

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

        .image-input {
          position: relative;
        }

        .image-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
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