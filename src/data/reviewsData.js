const STORAGE_KEY = 'furnitureReviews';

let idCounter = Date.now();
const genId = () => `rev_${++idCounter}`;

export function loadReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function saveReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      const withoutImages = reviews.map(r => ({ ...r, images: [] }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutImages));
      } catch {}
    }
  }
}

export function getProductReviews(productId) {
  const all = loadReviews();
  return all.filter(r => r.productId === productId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function addReview(productId, author, rating, text, images = []) {
  const all = loadReviews();
  const review = {
    id: genId(),
    productId,
    author: author.trim() || 'مستخدم',
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    text: text.trim(),
    images: images.slice(0, 3),
    date: new Date().toISOString(),
  };
  all.push(review);
  saveReviews(all);
  return review;
}

export function getProductAverageRating(productId, staticRating) {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return { avg: staticRating, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { avg: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}

export function getRatingDistribution(productId) {
  const reviews = getProductReviews(productId);
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => { if (dist[r.rating] !== undefined) dist[r.rating]++; });
  return dist;
}

export function getEffectiveRating(productId, staticRating) {
  const { avg, count } = getProductAverageRating(productId, staticRating);
  return { rating: count > 0 ? avg : staticRating, reviewCount: count > 0 ? count : 0 };
}
