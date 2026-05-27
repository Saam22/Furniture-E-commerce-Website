import React, { useState } from 'react';

const ProductCard = ({ product, addToCart, index, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div 
      className={`product-card ${viewMode}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        {!imageLoaded && <div className="image-loader"></div>}
        <img 
          src={product.image} 
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        
        {product.isNew && <span className="product-badge new">جديد</span>}
        {product.discount > 0 && (
          <span className="product-badge discount">خصم {product.discount}%</span>
        )}

        <div className={`product-overlay ${isHovered ? 'show' : ''}`}>
          <button className="quick-view-btn">
            <span>👁️</span>
            <span>معاينة سريعة</span>
          </button>
          <button className="wishlist-btn">
            <span>♡</span>
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        
        <h3 className="product-name">{product.name}</h3>
        
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="rating-text">({product.reviews} تقييم)</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">{product.price.toLocaleString()} ر.س</span>
            {product.originalPrice && (
              <span className="original-price">
                {product.originalPrice.toLocaleString()} ر.س
              </span>
            )}
          </div>

          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            <span className="btn-text">أضف للسلة</span>
            <span className="btn-icon">🛒</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;