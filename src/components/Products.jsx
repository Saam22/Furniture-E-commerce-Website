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
        return Number(b.isNew) - Number(a.isNew);
      default:
        return 0;
    }
  });

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="section-header products-header">
          <div>
            <h2>منتجاتنا المميزة</h2>
            <p>قطع مختارة بعناية لتجديد البيت من غير دوشة.</p>
          </div>

          <div className="products-controls">
            <label className="sort-control">
              <span>ترتيب حسب</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">الأكثر مناسبة</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييما</option>
                <option value="newest">الأحدث</option>
              </select>
            </label>

            <div className="view-toggle" aria-label="طريقة العرض">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} title="عرض شبكي">
                ▦
              </button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} title="عرض قائمة">
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
            <span className="no-products-icon">□</span>
            <h3>لا توجد منتجات في هذه الفئة</h3>
            <p>جرب فئة أخرى أو ارجع لكل المنتجات.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
