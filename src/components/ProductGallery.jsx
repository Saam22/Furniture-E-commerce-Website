import { useState, useEffect, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';
import { getProductGallery, getProductEnvironments } from '../data/productGallery';
import { getEffectiveRating } from '../data/reviewsData';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import '../styles/ProductGallery.css';

const ProductGallery = ({ product, onClose, addToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const galleryImages = getProductGallery(product);
  const environments = getProductEnvironments(product);
  const { rating: effectiveRating, reviewCount } = getEffectiveRating(product.id, product.rating);

  const currentImage = selectedEnv
    ? environments.find(e => e.id === selectedEnv)?.image || galleryImages[0]
    : galleryImages[selectedImage] || galleryImages[0];

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isZoomed) setIsZoomed(false);
      else onClose();
    }
    if (!isZoomed && !selectedEnv) {
      if (e.key === 'ArrowRight') setSelectedImage(p => (p + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setSelectedImage(p => (p - 1 + galleryImages.length) % galleryImages.length);
    }
  }, [isZoomed, selectedEnv, galleryImages.length, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleEnvToggle = (envId) => {
    setSelectedEnv(prev => prev === envId ? null : envId);
  };

  const handleThumbClick = (index) => {
    setSelectedImage(index);
    setSelectedEnv(null);
  };

  const handleReviewAdded = () => {
    setReviewSubmitted(true);
    setRefreshKey(k => k + 1);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <>
      <div className="gallery-overlay" onClick={onClose} />
      <div className="product-gallery" role="dialog" aria-label={product.name}>
        <button className="gallery-close" onClick={onClose} aria-label="إغلاق">✕</button>

        <div className="gallery-layout">
          <div className="gallery-media">
            <div
              className="gallery-main"
              onClick={() => !selectedEnv && setIsZoomed(true)}
              style={{ cursor: selectedEnv ? 'default' : 'zoom-in' }}
            >
              <div className="gallery-img-wrapper">
                <OptimizedImage
                  src={currentImage}
                  alt={product.name}
                  width={800}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  placeholder="skeleton"
                />
              </div>
              {selectedEnv && (
                <div className="env-badge">{environments.find(e => e.id === selectedEnv)?.name}</div>
              )}
            </div>

            {!selectedEnv && (
              <div className="gallery-thumbnails">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => handleThumbClick(i)}
                  >
                    <OptimizedImage
                      src={img}
                      alt={`${product.name} - زاوية ${i + 1}`}
                      width={72}
                      height={72}
                      sizes="72px"
                      placeholder="skeleton"
                    />
                  </button>
                ))}
              </div>
            )}

            {environments.length > 0 && (
              <div className="gallery-environments">
                <span className="env-label">معاينة في:</span>
                <div className="env-buttons">
                  {environments.map(env => (
                    <button
                      key={env.id}
                      className={`env-btn ${selectedEnv === env.id ? 'active' : ''}`}
                      onClick={() => handleEnvToggle(env.id)}
                    >
                      {env.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="gallery-sidebar">
            <span className="gallery-category">{product.category}</span>
            <h2 className="gallery-title">{product.name}</h2>
            <p className="gallery-desc">{product.description}</p>

            <div className="gallery-rating">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.round(effectiveRating) ? 'star filled' : 'star'}>★</span>
                ))}
              </div>
              <span className="gallery-reviews">
                {reviewCount > 0 ? `${reviewCount} تقييم` : `${product.reviews} تقييم`}
              </span>
            </div>

            <div className="gallery-pricing">
              <span className="gallery-price">{product.price.toLocaleString()} ج.م</span>
              {product.originalPrice && (
                <span className="gallery-original">{product.originalPrice.toLocaleString()} ج.م</span>
              )}
              {product.discount > 0 && (
                <span className="gallery-discount-badge">خصم {product.discount}%</span>
              )}
            </div>

            <button
              className="btn btn-primary gallery-add-btn"
              onClick={() => { addToCart(product); onClose(); }}
            >
              أضف للسلة
            </button>

            <div className="gallery-nav-hint">
              استخدم الأسهم ← → للتنقل بين الصور
            </div>
          </div>
        </div>

        <div
          className="gallery-reviews-toggle"
          onClick={() => setReviewsOpen(p => !p)}
        >
          <div className="gallery-reviews-toggle-left">
            <h3>التقييمات والمراجعات</h3>
            {reviewCount > 0 && <span className="review-badge-count">{reviewCount}</span>}
          </div>
          <span className={`toggle-arrow ${reviewsOpen ? 'open' : ''}`}>▼</span>
        </div>

        <div className={`gallery-reviews-body ${reviewsOpen ? 'open' : ''}`}>
          <div className="gallery-reviews-section" key={refreshKey}>
            <ReviewList
              productId={product.id}
              staticRating={product.rating}
            />
            <ReviewForm
              productId={product.id}
              onReviewAdded={handleReviewAdded}
            />
            {reviewSubmitted && (
              <div className="review-submitted-toast">تم نشر تقييمك بنجاح! شكراً لمشاركتك.</div>
            )}
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="gallery-zoom-overlay" onClick={() => setIsZoomed(false)}>
          <button className="zoom-close" onClick={() => setIsZoomed(false)} aria-label="إغلاق">✕</button>
          <div className="zoom-container" onClick={e => e.stopPropagation()}>
            <OptimizedImage
              src={currentImage}
              alt={product.name}
              width={1600}
              height={1600}
              sizes="90vw"
              placeholder="none"
              loading="eager"
            />
          </div>
          <div className="zoom-hint">اضغط خارج الصورة أو Esc للخروج</div>
        </div>
      )}
    </>
  );
};

export default ProductGallery;
