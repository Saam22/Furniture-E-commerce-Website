import { useState } from 'react';

// هايلايت النص المطابق في البحث
const Highlight = ({ text, query }) => {
  if (!query || !query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = String(text).split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="search-highlight">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const ProductCard = ({ product, addToCart, index, viewMode, searchQuery }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));

  return (
    <article
      className={`product-card ${viewMode}`}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="product-image">
        {!imageLoaded && <div className="image-loader"></div>}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        <div className="product-badges">
          {product.isNew && <span className="product-badge new">جديد</span>}
          {product.discount > 0 && (
            <span className="product-badge discount">خصم {product.discount}%</span>
          )}
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">
          <Highlight text={product.name} query={searchQuery} />
        </h3>
        <p className="product-description">
          <Highlight text={product.description} query={searchQuery} />
        </p>

        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="rating-text">{product.reviews} تقييم</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">{product.price.toLocaleString()} ج.م</span>
            {product.originalPrice && (
              <span className="original-price">
                {product.originalPrice.toLocaleString()} ج.م
              </span>
            )}
          </div>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            <span>أضف للسلة</span>
            <span className="btn-icon">+</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;