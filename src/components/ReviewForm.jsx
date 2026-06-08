import { useState, useRef } from 'react';
import { addReview } from '../data/reviewsData';

const MAX_IMAGES = 3;

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);
    const readers = toAdd.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(results => {
      setImages(prev => [...prev, ...results].slice(0, MAX_IMAGES));
    });
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) { setError('يرجى اختيار تقييم'); return; }
    if (!text.trim()) { setError('يرجى كتابة نص المراجعة'); return; }

    setSubmitting(true);
    const review = addReview(productId, author, rating, text, images);
    setAuthor('');
    setRating(0);
    setText('');
    setImages([]);
    setSubmitting(false);
    if (onReviewAdded) onReviewAdded(review);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4 className="review-form-title">أكتب تقييمك</h4>

      <div className="review-form-row">
        <div className="review-field">
          <label htmlFor="review-author">الاسم</label>
          <input
            id="review-author"
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="اسمك (اختياري)"
            maxLength={50}
          />
        </div>

        <div className="review-field">
          <label>التقييم</label>
          <div className="star-input">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="review-field">
        <label htmlFor="review-text">المراجعة</label>
        <textarea
          id="review-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="شارك تجربتك مع هذا المنتج..."
          rows={4}
          maxLength={500}
        />
        <span className="char-count">{text.length}/500</span>
      </div>

      <div className="review-field">
        <label>الصور</label>
        <div className="review-images-upload">
          {images.map((img, i) => (
            <div key={i} className="review-image-preview">
              <img src={img} alt={`صورة ${i + 1}`} />
              <button type="button" className="remove-image" onClick={() => removeImage(i)}>✕</button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              className="add-image-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <span>+</span>
              <small>أضف صورة</small>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
        </div>
        <span className="image-hint">يمكنك إضافة حتى {MAX_IMAGES} صور (jpg, png)</span>
      </div>

      {error && <div className="review-error">{error}</div>}

      <button type="submit" className="btn btn-primary review-submit" disabled={submitting}>
        {submitting ? 'جاري الإرسال...' : 'نشر التقييم'}
      </button>
    </form>
  );
};

export default ReviewForm;
