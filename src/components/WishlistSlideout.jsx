import { useState } from 'react';
import { productsData } from '../data/productsData';
import '../styles/Wishlist.css';

const WishlistSlideout = ({ onClose, wishlist, onToggleWishlist, onAddToCart }) => {
  const [notifyIds, setNotifyIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('furnitureNotify') || '[]'); } catch { return []; }
  });

  const wishlistProducts = productsData.filter(p => wishlist.includes(p.id));

  const handleNotify = (productId) => {
    const next = notifyIds.includes(productId)
      ? notifyIds.filter(id => id !== productId)
      : [...notifyIds, productId];
    setNotifyIds(next);
    localStorage.setItem('furnitureNotify', JSON.stringify(next));
  };

  const handleShare = () => {
    const ids = wishlist.join(',');
    const url = `${window.location.origin}${window.location.pathname}?wishlist=${ids}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('تم نسخ رابط المفضلة!');
    }).catch(() => {
      prompt('انسخ الرابط:', url);
    });
  };

  const total = wishlistProducts.reduce((s, p) => s + p.price, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <aside className="wishlist-sidebar">
        <div className="cart-header">
          <h2>المفضلة ❤️</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-icon">🤍</span>
            <h3>المفضلة فارغة</h3>
            <p>اضغط على ♡ في أي منتج لإضافته هنا.</p>
            <button className="btn btn-primary" onClick={onClose}>تصفح المنتجات</button>
          </div>
        ) : (
          <>
            <div className="wishlist-body">
              {wishlistProducts.map(product => {
                const isNotifying = notifyIds.includes(product.id);
                return (
                  <div key={product.id} className="wishlist-item">
                    <img src={product.image} alt={product.name} />
                    <div className="wishlist-item-info">
                      <h4>{product.name}</h4>
                      <p className="wishlist-item-cat">{product.category}</p>
                      <span className="wishlist-item-price">{product.price.toLocaleString()} ج.م</span>
                    </div>
                    <div className="wishlist-item-actions">
                      <button className="wishlist-add-cart" onClick={() => onAddToCart(product)} title="أضف للسلة">
                        🛒
                      </button>
                      <button className={`wishlist-notify ${isNotifying ? 'active' : ''}`} onClick={() => handleNotify(product.id)} title={isNotifying ? 'إلغاء التنبيه' : 'نبهني عند التخفيض'}>
                        {isNotifying ? '🔔' : '🔕'}
                      </button>
                      <button className="wishlist-remove" onClick={() => onToggleWishlist(product.id)} title="إزالة">
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="wishlist-footer">
              <div className="wishlist-total">
                <span>الإجمالي</span>
                <span>{total.toLocaleString()} ج.م</span>
              </div>
              <div className="wishlist-footer-actions">
                <button className="btn btn-primary" onClick={() => { wishlistProducts.forEach(p => onAddToCart(p)); }}>
                  🛒 أضف الكل للسلة
                </button>
                <button className="wishlist-share-btn" onClick={handleShare}>
                  🔗 شارك المفضلة
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default WishlistSlideout;
