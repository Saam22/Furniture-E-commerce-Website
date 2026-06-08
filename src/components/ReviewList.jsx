import { useState, useEffect } from 'react';
import { getProductReviews, getProductAverageRating, getRatingDistribution } from '../data/reviewsData';

const STARS = [5, 4, 3, 2, 1];

const StarDisplay = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={i <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
    ))}
  </div>
);

const ReviewCard = ({ review }) => {
  const [showAllImages, setShowAllImages] = useState(false);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-avatar">{review.author.charAt(0)}</div>
        <div>
          <span className="review-author">{review.author}</span>
          <div className="review-card-meta">
            <StarDisplay rating={review.rating} />
            <span className="review-date">{formatDate(review.date)}</span>
          </div>
        </div>
      </div>
      <p className="review-text">{review.text}</p>
      {review.images && review.images.length > 0 && (
        <div className={`review-card-images ${showAllImages ? 'expanded' : ''}`}>
          {review.images.slice(0, showAllImages ? review.images.length : 2).map((img, i) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="review-thumb-link">
              <img src={img} alt={`صورة مراجعة ${i + 1}`} />
            </a>
          ))}
          {review.images.length > 2 && !showAllImages && (
            <button className="review-more-images" onClick={() => setShowAllImages(true)}>
              +{review.images.length - 2}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ReviewList = ({ productId, staticRating }) => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  const refresh = () => {
    const all = getProductReviews(productId);
    setReviews(sortReviews(all, sortBy));
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [productId, sortBy]);

  const { avg, count } = getProductAverageRating(productId, staticRating);
  const distribution = getRatingDistribution(productId);

  return (
    <div className="review-list">
      <div className="review-summary">
        <div className="review-summary-main">
          <span className="review-avg-rating">{avg}</span>
          <div className="review-summary-stars">
            <StarDisplay rating={avg} />
            <span className="review-total-count">{count > 0 ? `مبني على ${count} تقييم` : 'لا توجد تقييمات بعد'}</span>
          </div>
        </div>
        <div className="review-distribution">
          {STARS.map(star => {
            const pct = count > 0 ? (distribution[star] || 0) / count * 100 : 0;
            return (
              <div key={star} className="dist-row">
                <span className="dist-label">{star} ★</span>
                <div className="dist-bar-bg">
                  <div className="dist-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="dist-count">{distribution[star] || 0}</span>
              </div>
            );
          })}
        </div>
      </div>

      {reviews.length > 1 && (
        <div className="review-sort">
          <label>ترتيب:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="highest">الأعلى تقييماً</option>
            <option value="lowest">الأقل تقييماً</option>
          </select>
        </div>
      )}

      <div className="review-cards">
        {reviews.length === 0 ? (
          <div className="review-empty">
            <span className="review-empty-icon">★</span>
            <p>لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!</p>
          </div>
        ) : (
          reviews.map(r => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </div>
  );
};

function sortReviews(reviews, sortBy) {
  const sorted = [...reviews];
  switch (sortBy) {
    case 'newest': return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest': return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'highest': return sorted.sort((a, b) => b.rating - a.rating);
    case 'lowest': return sorted.sort((a, b) => a.rating - b.rating);
    default: return sorted;
  }
}

export default ReviewList;
