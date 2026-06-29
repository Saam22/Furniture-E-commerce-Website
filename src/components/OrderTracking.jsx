import { useState } from 'react';
import { ORDER_STATUSES } from '../data/shippingData';
import { statusIndex } from '../utils/shippingUtils';
import '../styles/Cart.css';

const OrderCard = ({ order, isExpanded, onToggle, onCancelOrder }) => {
  const items = order.items || [];
  const currentIdx = statusIndex(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="tracking-order">
      <div
        className="tracking-order-header tracking-order-header-clickable"
        onClick={onToggle}
      >
        <div>
          <span className="tracking-order-id">
            {order.items?.[0]?.name || 'طلب'}
            {order.items?.length > 1 && <span className="tracking-order-more"> +{order.items.length - 1}</span>}
          </span>
          <span className="tracking-order-date">
            {order.date ? new Date(order.date).toLocaleDateString('ar-EG') : '—'}
          </span>
        </div>
        <div className="tracking-order-header-left">
          <span className="tracking-order-status">
            {ORDER_STATUSES.find(s => s.id === order.status)?.label || order.status}
          </span>
          <span className={`tracking-expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      <div className="tracking-order-body">
      <div className={`tracking-timeline ${order.status === 'cancelled' ? 'cancelled' : ''}`}>
        {ORDER_STATUSES.map((s, i) => {
          const isCancelledOrder = order.status === 'cancelled';
          const isCancelledStep = isCancelledOrder && s.id === 'cancelled';
          const wasDone = isCancelledOrder ? false : i <= currentIdx;
          const isCurrent = isCancelledStep ? true : (!isCancelledOrder && i === currentIdx);
          const isWrong = isCancelledOrder && i < ORDER_STATUSES.findIndex(st => st.id === 'cancelled');
          return (
            <div key={s.id} className={`tracking-step ${wasDone ? 'done' : ''} ${isCurrent ? 'current' : ''} ${isCancelledStep ? 'cancelled-step' : ''} ${isWrong ? 'wrong-step' : ''}`}>
              <div className="tracking-step-dot">
                {wasDone ? '\u2713' : isWrong ? '' : isCurrent ? s.icon : '\u25CB'}
              </div>
              <span className="tracking-step-label">{s.label}</span>
            </div>
          );
        })}
      </div>

      {isExpanded && (
        <>
          <div className="tracking-order-items">
            <h4 className="tracking-section-title">المنتجات</h4>
            {items.map((item, idx) => (
              <div key={item.id || idx} className="tracking-order-item">
                <div className="tracking-item-image-wrapper">
                  <img src={item.image} alt={item.name} loading="lazy" width="60" height="60" />
                </div>
                <div className="tracking-item-details">
                  <span className="tracking-item-name">{item.name}</span>
                  <span className="tracking-item-qty">الكمية: {item.quantity || 1}</span>
                  <span className="tracking-item-price">
                    {item.price?.toLocaleString() ?? '0'} ج.م × {item.quantity || 1} = {(item.price * (item.quantity || 1)).toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="tracking-order-summary">
            <h4 className="tracking-section-title">تفاصيل المبلغ</h4>
            <div className="tracking-summary-details">
              <div className="tracking-summary-row">
                <span>مجموع المنتجات</span>
                <span>{order.subtotal?.toLocaleString() ?? '—'} ج.م</span>
              </div>
              {order.shipping > 0 && (
                <div className="tracking-summary-row">
                  <span>الشحن</span>
                  <span>+{order.shipping.toLocaleString()} ج.م</span>
                </div>
              )}
              {order.shipping === 0 && (
                <div className="tracking-summary-row">
                  <span>الشحن</span>
                  <span>مجاني</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="tracking-summary-row discount">
                  <span>الخصم</span>
                  <span>-{order.discount.toLocaleString()} ج.م</span>
                </div>
              )}
              {order.couponCode && (
                <div className="tracking-summary-row">
                  <span>كود الخصم</span>
                  <span className="tracking-coupon-badge">{order.couponCode}</span>
                </div>
              )}
              <div className="tracking-summary-divider" />
              <div className="tracking-summary-row grand-total">
                <span>الإجمالي</span>
                <span>{order.grandTotal == null || isNaN(order.grandTotal) ? '—' : `${Number(order.grandTotal).toLocaleString()} ج.م`}</span>
              </div>
              {order.pointsEarned > 0 && (
                <div className="tracking-summary-row points">
                  <span>نقاط مكتسبة</span>
                  <span>+{order.pointsEarned} نقطة</span>
                </div>
              )}
            </div>
          </div>

          <div className="tracking-order-info">
            <h4 className="tracking-section-title">معلومات التوصيل</h4>
            <div className="tracking-info-row">
              <span>المنطقة</span>
              <span>{order.delivery?.city || '—'}</span>
            </div>
            <div className="tracking-info-row">
              <span>نوع الشحن</span>
              <span>{order.delivery?.express ? 'إكسبرس' : 'عادي'}</span>
            </div>
            {order.delivery?.address && (
              <div className="tracking-info-row">
                <span>العنوان</span>
                <span>{order.delivery.address}</span>
              </div>
            )}
            {order.delivery?.phone && (
              <div className="tracking-info-row">
                <span>الهاتف</span>
                <span>{order.delivery.phone}</span>
              </div>
            )}
            {order.delivery?.eta && (
              <div className="tracking-info-row">
                <span>وقت التوصيل</span>
                <span>{order.delivery.eta.min}-{order.delivery.eta.max} أيام</span>
              </div>
            )}
          </div>
        </>
      )}

      {canCancel && (
        <button className="tracking-cancel-btn" onClick={() => onCancelOrder?.(order.id)}>
          إلغاء الطلب
        </button>
      )}
      </div>
    </div>
  );
};

const OrderTracking = ({ orders = [], onCancelOrder }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  const activeOrders = orders.filter(Boolean).filter(o => o.status !== 'cancelled');
  const cancelledOrders = orders.filter(Boolean).filter(o => o.status === 'cancelled');
  const displayOrders = activeTab === 'active' ? activeOrders : cancelledOrders;

  return (
    <aside className="tracking-sidebar tracking-page">
      <div className="cart-header">
        <h2>طلباتي</h2>
      </div>

      <div className="tracking-tabs">
        <button className={`tracking-tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
          الطلبات النشطة
          {activeOrders.length > 0 && <span className="tracking-tab-count">{activeOrders.length}</span>}
        </button>
        <button className={`tracking-tab ${activeTab === 'cancelled' ? 'active cancelled-tab' : ''}`} onClick={() => setActiveTab('cancelled')}>
          الملغية
          {cancelledOrders.length > 0 && <span className="tracking-tab-count cancelled">{cancelledOrders.length}</span>}
        </button>
      </div>

      {displayOrders.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-icon">{activeTab === 'active' ? '📦' : '🗑️'}</span>
          <h3>{activeTab === 'active' ? 'لا توجد طلبات نشطة' : 'لا توجد طلبات ملغية'}</h3>
          <p>{activeTab === 'active' ? 'لم تقم بأي طلب بعد. ابدأ بتصميم قطعتك!' : 'ليس لديك أي طلبات ملغية'}</p>
        </div>
      ) : (
        <div className="tracking-orders">
          {[...displayOrders].reverse().map(order => (
            <OrderCard
              key={order.id || `order-${order.date}-${order.grandTotal}`}
              order={order}
              isExpanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
              onCancelOrder={onCancelOrder}
            />
          ))}
        </div>
      )}
    </aside>
  );
};

export default OrderTracking;
