import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({ name: '', category: '', price: '', stock: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    }
  };

  const deleteProduct = async (id) => {
    console.log('Attempting to delete product with ID:', id);
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`/api/products/${id}`);
        if (response.status === 200) {
          fetchProducts();
        } else {
          setError('Failed to delete product: ' + response.data.message);
        }
      } catch (err) {
        setError('Failed to delete product: ' + (err.response?.data?.error || err.message));
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct(prev => ({ ...prev, [name]: value }));
  };

  const saveProduct = async (id) => {
    console.log('Attempting to save product with ID:', id, 'Data:', updatedProduct);
    try {
      const response = await axios.put(`/api/products/${id}`, updatedProduct);
      if (response.status === 200) {
        setEditingProduct(null);
        fetchProducts();
      } else {
        setError('Failed to update product: ' + response.data.message);
      }
    } catch (err) {
      setError('Failed to update product: ' + (err.response?.data?.error || err.message));
      console.error('Error updating product:', err);
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Products</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="products-list">
        {products.map(product => (
          <div key={product._id} className="product-card">
            {editingProduct === product._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="name"
                  value={updatedProduct.name}
                  onChange={handleEditChange}
                  placeholder="Product Name"
                />
                <input
                  type="text"
                  name="category"
                  value={updatedProduct.category}
                  onChange={handleEditChange}
                  placeholder="Category"
                />
                <input
                  type="number"
                  name="price"
                  value={updatedProduct.price}
                  onChange={handleEditChange}
                  placeholder="Price"
                />
                <input
                  type="number"
                  name="stock"
                  value={updatedProduct.stock}
                  onChange={handleEditChange}
                  placeholder="Stock"
                />
                <button onClick={() => saveProduct(product._id)}>Save</button>
                <button onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            ) : (
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price}</p>
                <p>Stock: {product.stock}</p>
                <button onClick={() => {
                  setEditingProduct(product._id);
                  setUpdatedProduct({
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    stock: product.stock
                  });
                }}>Edit</button>
                <button onClick={() => deleteProduct(product._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProducts;  