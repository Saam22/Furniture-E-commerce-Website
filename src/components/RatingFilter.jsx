const RATING_OPTIONS = [
  { value: 0, label: 'الكل' },
  { value: 4, label: '٤★' },
  { value: 3, label: '٣★' },
  { value: 2, label: '٢★' },
  { value: 1, label: '١★' },
];

const RatingFilter = ({ minRating, onChange }) => {
  return (
    <div className="rating-filter">
      <span className="rating-filter-label">التقييم:</span>
      <div className="rating-filter-buttons">
        {RATING_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`rating-filter-btn ${minRating === opt.value ? 'active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.value > 0 && (
              <span className="rating-filter-stars">{opt.label}</span>
            )}
            {opt.value === 0 && <span>{opt.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;
