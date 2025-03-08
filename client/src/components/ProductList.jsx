import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { FaFilter } from 'react-icons/fa';

function ProductList({ products, addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      ));
    }
  }, [selectedCategory, products]);

  const categories = ['all', ...new Set(products.map(product => product.category.toLowerCase()))];

  return (
    <div className="product-list-container">
      <div className="filters-container">
        <button 
          className="filter-toggle"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FaFilter /> Categories
        </button>
        
        <div className={`category-filters ${isFilterOpen ? 'open' : ''}`}>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setIsFilterOpen(false);
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            addToCart={addToCart}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found in this category</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .product-list-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .filters-container {
          margin-bottom: 30px;
          position: relative;
        }

        .filter-toggle {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 25px;
          font-weight: 600;
          color: #1a237e;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 25px;
          background: white;
          color: #1a237e;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e0e0e0;
        }

        .category-btn:hover {
          background: #f5f5f5;
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: #1a237e;
          color: white;
          border-color: #1a237e;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          padding: 20px 0;
        }

        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background: #f5f5f5;
          border-radius: 15px;
          color: #666;
        }

        @media (max-width: 768px) {
          .product-list-container {
            padding: 15px;
          }

          .filter-toggle {
            display: flex;
            margin-bottom: 15px;
          }

          .category-filters {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 15px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 100;
            margin-top: 10px;
          }

          .category-filters.open {
            display: flex;
          }

          .category-btn {
            flex: 1;
            text-align: center;
            white-space: nowrap;
          }

          .products-grid {
            gap: 15px;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

export default ProductList;