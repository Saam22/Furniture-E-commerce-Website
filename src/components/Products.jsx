import React, { useState } from 'react';
import ProductCard from './ProductCard';
import '../styles/Products.css';

const Products = ({ products, addToCart }) => {
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew - a.isNew;
      default:
        return 0;
    }
  });

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>منتجاتنا المميزة</h2>
            <p>اكتشف مجموعة واسعة من الأثاث العصري</p>
          </div>
          
          <div className="products-controls">
            <div className="sort-control">
              <label>ترتيب حسب:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">الافتراضي</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="newest">الأحدث</option>
              </select>
            </div>

            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="عرض شبكي"
              >
                ▦
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="عرض قائمة"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        <div className={`products-${viewMode}`}>
          {sortedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              index={index}
              viewMode={viewMode}
            />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="no-products">
            <span className="no-products-icon">📦</span>
            <h3>لا توجد منتجات في هذه الفئة</h3>
            <p>جرب فئة أخرى</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;