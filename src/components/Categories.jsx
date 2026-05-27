import React from 'react';
import { categories } from '../data/productsData';
import '../styles/Products.css';

const Categories = ({ selectedCategory, onSelectCategory }) => {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>تصفح حسب الفئة</h2>
          <p>اختر الفئة المناسبة لك</p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(category.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <span className="category-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;