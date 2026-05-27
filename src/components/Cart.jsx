import React, { useEffect } from 'react';
import '../styles/Cart.css';

const Cart = ({ cartItems, onClose, removeFromCart, updateQuantity, clearCart, total, savings }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCheckout = () => {
    alert('جاري تحويلك لصفحة الدفع...');
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>
            <span>🛒</span>
            <span>سلة التسوق</span>
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-icon">🛒</span>
            <h3>السلة فارغة</h3>
            <p>ابدأ بإضافة منتجات رائعة!</p>
            <button className="btn btn-primary" onClick={onClose}>
              تسوق الآن
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="item-category">{item.category}</p>
                    
                    <div className="item-price-row">
                      <span className="item-price">{item.price.toLocaleString()} ر.س</span>
                      {item.originalPrice && (
                        <span className="item-original-price">
                          {item.originalPrice.toLocaleString()} ر.س
                        </span>
                      )}
                    </div>

                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    title="حذف"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>المجموع الفرعي:</span>
                <span>{(total + savings).toLocaleString()} ر.س</span>
              </div>
              
              {savings > 0 && (
                <div className="summary-row savings">
                  <span>التوفير:</span>
                  <span>- {savings.toLocaleString()} ر.س</span>
                </div>
              )}

              <div className="summary-row">
                <span>الشحن:</span>
                <span>{total >= 1000 ? 'مجاني' : '50 ر.س'}</span>
              </div>

              <div className="summary-total">
                <span>المجموع النهائي:</span>
                <span>{(total + (total >= 1000 ? 0 : 50)).toLocaleString()} ر.س</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                <span>إتمام الطلب</span>
                <span>💳</span>
              </button>

              <button className="clear-cart-btn" onClick={clearCart}>
                تفريغ السلة
              </button>

              <div className="payment-methods">
                <span>طرق الدفع المتاحة:</span>
                <div className="methods">
                  <span>💳</span>
                  <span>🏦</span>
                  <span>📱</span>
                  <span>💰</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;