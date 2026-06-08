import { productsData } from '../data/productsData';
import '../styles/Compare.css';

const CompareSlideout = ({ onClose, compareIds, onToggleCompare, onAddToCart }) => {
  const compareProducts = productsData.filter(p => compareIds.includes(p.id));

  const bestPrice = Math.min(...compareProducts.map(p => p.price));
  const bestRating = Math.max(...compareProducts.map(p => p.rating));
  const bestDiscount = Math.max(...compareProducts.map(p => p.discount || 0));

  const handleClearAll = () => {
    compareIds.forEach(id => onToggleCompare(id));
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <aside className="compare-sidebar">
        <div className="cart-header">
          <h2>مقارنة المنتجات ⚖️</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {compareProducts.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-icon">⚖️</span>
            <h3>لا توجد منتجات للمقارنة</h3>
            <p>أضف منتجين أو أكثر للمقارنة بينهم بسهولة.</p>
            <button className="btn btn-primary" onClick={onClose}>تصفح المنتجات</button>
          </div>
        ) : (
          <>
            {compareProducts.length < 2 && (
              <div className="compare-hint">
                أضف منتجاً آخر على الأقل للمقارنة
              </div>
            )}

            <div className="compare-body">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="compare-label-cell">المنتج</th>
                    {compareProducts.map(product => (
                      <th key={product.id} className="compare-product-cell">
                        <div className="compare-img-wrap">
                          <img src={product.image} alt={product.name} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="compare-label-cell">الاسم</td>
                    {compareProducts.map(product => (
                      <td key={product.id} className="compare-value-cell">
                        <strong>{product.name}</strong>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="compare-label-cell">الفئة</td>
                    {compareProducts.map(product => (
                      <td key={product.id} className="compare-value-cell">
                        <span className="compare-category-tag">{product.category}</span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="compare-label-cell">السعر</td>
                    {compareProducts.map(product => (
                      <td key={product.id} className={`compare-value-cell ${product.price === bestPrice ? 'best-value' : ''}`}>
                        <div className="compare-price">
                          <span className="compare-current-price">{product.price.toLocaleString()} ج.م</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="compare-original-price">{product.originalPrice.toLocaleString()} ج.م</span>
                          )}
                        </div>
                        {product.price === bestPrice && <span className="best-badge">أفضل سعر</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="compare-label-cell">الخصم</td>
                    {compareProducts.map(product => (
                      <td key={product.id} className={`compare-value-cell ${(product.discount || 0) === bestDiscount && bestDiscount > 0 ? 'best-value' : ''}`}>
                        {product.discount > 0 ? `${product.discount}%` : '—'}
                        {(product.discount || 0) === bestDiscount && bestDiscount > 0 && <span className="best-badge">أفضل خصم</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="compare-label-cell">التقييم</td>
                    {compareProducts.map(product => (
                      <td key={product.id} className={`compare-value-cell ${product.rating === bestRating ? 'best-value' : ''}`}>
                        <div className="compare-stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < product.rating ? 'star filled' : 'star'}>★</span>
                          ))}
                        </div>
                        <span className="compare-reviews">({product.reviews} تقييم)</span>
                        {product.rating === bestRating && <span className="best-badge">الأفضل</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="compare-label-cell">الوصف</td>
                    {compareProducts.map(product => (
                      <td key={product.id} className="compare-value-cell">
                        <p className="compare-desc">{product.description}</p>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="compare-label-cell">وسوم</td>
                    {compareProducts.map(product => (
                      <td key={product.id} className="compare-value-cell">
                        <div className="compare-tags">
                          {product.isNew && <span className="compare-tag tag-new">جديد</span>}
                          {product.discount > 0 && <span className="compare-tag tag-discount">خصم {product.discount}%</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="compare-footer">
              <div className="compare-footer-actions">
                {compareProducts.map(product => (
                  <button
                    key={product.id}
                    className="btn btn-primary compare-add-cart"
                    onClick={() => onAddToCart(product)}
                  >
                    أضف للسلة
                  </button>
                ))}
              </div>
              <div className="compare-footer-secondary">
                {compareProducts.map(product => (
                  <button
                    key={product.id}
                    className="compare-remove-btn"
                    onClick={() => onToggleCompare(product.id)}
                    title="إزالة من المقارنة"
                  >
                    × {product.name}
                  </button>
                ))}
              </div>
              {compareProducts.length >= 2 && (
                <button className="compare-clear-all" onClick={handleClearAll}>
                  مسح الكل
                </button>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CompareSlideout;
