import { categories } from '../data/productsData';
import '../styles/Products.css';

const Categories = ({ selectedCategory, onSelectCategory }) => {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>تصفح حسب الفئة</h2>
          <p>اختار نوع الأثاث المناسب لمساحتك وذوقك.</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
