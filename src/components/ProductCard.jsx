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

const ProductCard = ({ product, addToCart, index, viewMode, searchQuery, isInWishlist, onToggleWishlist, isInCompare, onToggleCompare, onOpenGallery }) => {
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
        <button
          className={`wishlist-heart ${isInWishlist ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          title={isInWishlist ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
        >
          {isInWishlist ? '❤️' : '🤍'}
        </button>
        <button
          className={`compare-toggle ${isInCompare ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
          title={isInCompare ? 'إزالة من المقارنة' : 'أضف للمقارنة'}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="7" height="16" rx="1" />
            <rect x="14" y="4" width="7" height="16" rx="1" />
            <line x1="6.5" y1="9" x2="6.5" y2="15" />
            <line x1="17.5" y1="9" x2="17.5" y2="15" />
          </svg>
        </button>
        <button
          className="gallery-trigger"
          onClick={(e) => { e.stopPropagation(); onOpenGallery(); }}
          title="معرض الصور"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
        </button>
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