import { useState } from 'react';
import { bundles, getBundleProducts, calcBundleTotal } from '../data/bundlesData';
import '../styles/Bundles.css';

const BundlesPage = ({ addToCart }) => {
  const [customizing, setCustomizing] = useState(null);
  const [selected, setSelected] = useState({});

  const handleToggleCustomize = (bundleId) => {
    if (customizing === bundleId) {
      setCustomizing(null);
      return;
    }
    setCustomizing(bundleId);
    const bundle = bundles.find(b => b.id === bundleId);
    setSelected(prev => ({
      ...prev,
      [bundleId]: bundle.items,
    }));
  };

  const handleToggleItem = (bundleId, itemId) => {
    setSelected(prev => {
      const current = prev[bundleId] || [];
      const updated = current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId];
      return { ...prev, [bundleId]: updated };
    });
  };

  const handleAddBundle = (bundle) => {
    const ids = selected[bundle.id];
    const items = ids && ids.length > 0
      ? getBundleProducts(bundle).filter(p => ids.includes(p.id))
      : getBundleProducts(bundle);

    if (items.length === 0) return;

    items.forEach(item => addToCart(item));
    setCustomizing(null);
  };

  return (
    <div className="bundles-page">
      <div className="bundles-page-hero">
        <div className="container">
          <h1>الحزم الموفرة</h1>
          <p>طقم كامل لغرفتك بسعر مخفض — وفر أكتر لما تشتري الكل.</p>
        </div>
      </div>

      <div className="container">
        <div className="bundles-grid">
          {bundles.map(bundle => {
            const isCustomizing = customizing === bundle.id;
            const selectedIds = selected[bundle.id] || bundle.items;
            const products = getBundleProducts(bundle);
            const totals = calcBundleTotal(bundle, selectedIds);
            const allSelected = selectedIds.length === bundle.items.length;

            return (
              <div key={bundle.id} className="bundle-card">
                <div className="bundle-image">
                  <img src={bundle.image} alt={bundle.name} loading="lazy" />
                  <span className="bundle-discount-badge">-{bundle.discount}%</span>
                  <span className="bundle-save-badge">{bundle.badge}</span>
                </div>

                <div className="bundle-body">
                  <h3 className="bundle-name">{bundle.name}</h3>
                  <p className="bundle-desc">{bundle.description}</p>

                  <div className="bundle-items-list">
                    {products.map(product => {
                      const included = selectedIds.includes(product.id);
                      return (
                        <div
                          key={product.id}
                          className={`bundle-item ${isCustomizing ? 'selectable' : ''} ${included ? 'included' : 'excluded'}`}
                          onClick={() => isCustomizing && handleToggleItem(bundle.id, product.id)}
                          role={isCustomizing ? 'button' : undefined}
                          tabIndex={isCustomizing ? 0 : undefined}
                          onKeyDown={e => isCustomizing && (e.key === 'Enter' || e.key === ' ') && handleToggleItem(bundle.id, product.id)}
                        >
                          {isCustomizing && (
                            <span className="bundle-item-check">{included ? '✓' : ''}</span>
                          )}
                          <img src={product.image} alt={product.name} />
                          <div className="bundle-item-info">
                            <span className="bundle-item-name">{product.name}</span>
                            <span className="bundle-item-price">{product.price.toLocaleString()} ج.م</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bundle-pricing">
                    <div className="bundle-pricing-row">
                      <span>لو اشتريتها منفردة</span>
                      <span className="bundle-original">{totals.subtotal.toLocaleString()} ج.م</span>
                    </div>
                    <div className="bundle-pricing-row bundle-final">
                      <span>سعر الحزمة</span>
                      <span className="bundle-price">{totals.bundlePortion.toLocaleString()} ج.م</span>
                    </div>
                    {totals.savings > 0 && (
                      <div className="bundle-pricing-row bundle-savings">
                        <span>توفير</span>
                        <span>- {totals.savings.toLocaleString()} ج.م</span>
                      </div>
                    )}
                  </div>

                  <div className="bundle-actions">
                    <button
                      className="btn btn-primary bundle-add-btn"
                      onClick={() => handleAddBundle(bundle)}
                      disabled={selectedIds.length === 0}
                    >
                      أضف الحزمة ({selectedIds.length})
                    </button>
                    <button
                      className={`bundle-customize-btn ${isCustomizing ? 'active' : ''}`}
                      onClick={() => handleToggleCustomize(bundle.id)}
                    >
                      {isCustomizing ? 'تأكيد الاختيار' : allSelected ? 'تخصيص' : `تخصيص (${selectedIds.length})`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BundlesPage;
