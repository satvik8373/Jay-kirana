import React from 'react';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';

const Products = () => {
  return (
    <div className="products-admin-container">
      <h2>Product Management</h2>
      <div className="products-sections">
        <section className="add-product-section">
          <h3>Add New Product</h3>
          <AddProduct />
        </section>
        <section className="manage-products-section">
          <h3>Manage Products</h3>
          <ManageProducts />
        </section>
      </div>
    </div>
  );
};

export default Products; 