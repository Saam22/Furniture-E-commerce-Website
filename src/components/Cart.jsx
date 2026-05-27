import React from 'react';
import { motion } from 'framer-motion';

const Cart = ({ cartItems, onClose, removeFromCart, updateQuantity, total }) => {
  return (
    <>
      <motion.div
        className="cart-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="cart-sidebar"
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="cart-header">
          <h2>🛒 سلة التسوق</h2>
          <motion.button
            className="close-btn"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <motion.div
              className="empty-cart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="empty-icon">🛒</span>
              <p>السلة فارغة</p>
              <span>ابدأ بإضافة منتجات رائعة!</span>
            </motion.div>
          ) : (
            cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="cart-item"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <img src={item.image} alt={item.name} />
                
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">{item.price} ر.س</p>
                  
                  <div className="quantity-controls">
                    <motion.button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      -
                    </motion.button>
                    <span>{item.quantity}</span>
                    <motion.button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  whileHover={{ scale: 1.2, color: '#ff4444' }}
                  whileTap={{ scale: 0.8 }}
                >
                  🗑️
                </motion.button>
              </motion.div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <motion.div
            className="cart-footer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="cart-total">
              <span>المجموع:</span>
              <motion.span
                className="total-price"
                key={total}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {total.toFixed(2)} ر.س
              </motion.span>
            </div>

            <motion.button
              className="checkout-btn"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255,107,53,0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              إتمام الطلب 💳
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default Cart;