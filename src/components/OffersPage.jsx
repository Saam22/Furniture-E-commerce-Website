import { getAllActiveOffers } from '../utils/discountUtils';
import { productsData } from '../data/productsData';
import '../styles/OffersPage.css';

const OffersPage = ({ addToCart }) => {
  const activeOffers = getAllActiveOffers();
  const discountedProducts = productsData.filter(p => p.discount > 0);

  return (
    <div className="offers-page">
      <div className="offers-hero">
        <div className="container">
          <h1>العروض والتخفيضات</h1>
          <p>خصومات قوية على مجموعة مختارة — لفترة محدودة</p>
        </div>
      </div>

      <div className="container">
        {activeOffers.length > 0 && (
          <section className="offers-banners-section">
            <h2 className="offers-section-title">العروض النشطة</h2>
            <div className="offers-banners-grid">
              {activeOffers.map(offer => (
                <div key={offer.id} className="offers-banner-card" style={{ borderRightColor: offer.color }}>
                  <span className="offers-banner-badge" style={{ background: offer.color }}>{offer.badge}</span>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="offers-products-section">
          <h2 className="offers-section-title">المنتجات المخفضة</h2>
          <p className="offers-section-subtitle">{discountedProducts.length} منتج بخصم يصل إلى 31%</p>

          <div className="offers-products-grid">
            {discountedProducts.map(product => (
              <div key={product.id} className="offers-product-card">
                <div className="offers-product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="offers-discount-pill">-{product.discount}%</span>
                </div>
                <div className="offers-product-body">
                  <span className="offers-product-category">{product.category}</span>
                  <h3 className="offers-product-name">{product.name}</h3>
                  <div className="offers-product-pricing">
                    <span className="offers-current-price">{product.price.toLocaleString()} ج.م</span>
                    <span className="offers-original-price">{product.originalPrice.toLocaleString()} ج.م</span>
                  </div>
                  <button className="btn btn-primary offers-add-btn" onClick={() => addToCart(product)}>
                    أضف للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OffersPage;
