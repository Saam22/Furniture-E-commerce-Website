import { ORDER_STATUSES } from '../data/shippingData';
import { statusIndex } from '../utils/shippingUtils';
import '../styles/Cart.css';

const OrderTracking = ({ orders = [], onClose }) => {
  if (orders.length === 0) {
    return (
      <aside className="tracking-sidebar">
        <div className="cart-header">
          <h2>طلباتي</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="empty-cart">
          <span className="empty-icon">📦</span>
          <h3>لا توجد طلبات</h3>
          <p>لم تقم بأي طلب بعد. ابدأ بتصميم قطعتك!</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="tracking-sidebar">
      <div className="cart-header">
        <h2>طلباتي</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="tracking-orders">
        {[...orders].filter(Boolean).reverse().map(order => {
          const items = order.items || [];
          const currentIdx = statusIndex(order.status);
          return (
            <div key={order.id || Math.random()} className="tracking-order">
              <div className="tracking-order-header">
                <span className="tracking-order-id">{order.id || '—'}</span>
                <span className="tracking-order-date">
                  {order.date ? new Date(order.date).toLocaleDateString('ar-EG') : '—'}
                </span>
              </div>

              <div className="tracking-timeline">
                {ORDER_STATUSES.map((s, i) => (
                  <div key={s.id} className={`tracking-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}`}>
                    <div className="tracking-step-dot">
                      {i < currentIdx ? '✓' : i === currentIdx ? s.icon : '○'}
                    </div>
                    <span className="tracking-step-label">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="tracking-order-summary">
                <span>العدد: {items.reduce((s, i) => s + (i.quantity || 0), 0)} قطعة</span>
                <span>الإجمالي: {order.grandTotal == null || isNaN(order.grandTotal) ? '—' : `${order.grandTotal.toLocaleString()} ج.م`}</span>
              </div>

              {order.delivery && (
                <div className="tracking-delivery-info">
                  🚚 {order.delivery.city || '—'} | {order.delivery.express ? 'إكسبرس' : 'عادي'}
                  {order.delivery.freeShipping && ' | شحن مجاني'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default OrderTracking;
