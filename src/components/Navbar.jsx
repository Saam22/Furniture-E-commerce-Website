import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ cartItemsCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="nav-content">
          <motion.div
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="logo-icon">🛋️</span>
            <span className="logo-text">الأثاث العصري</span>
          </motion.div>

          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {['الرئيسية', 'المنتجات', 'العروض', 'من نحن', 'اتصل بنا'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <a href={`#${item}`}>{item}</a>
              </motion.li>
            ))}
          </ul>

          <div className="nav-actions">
            <motion.button
              className="icon-btn search-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🔍
            </motion.button>

            <motion.button
              className="icon-btn cart-btn"
              onClick={onCartClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🛒
              {cartItemsCount > 0 && (
                <motion.span
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              className="hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <span></span>
              <span></span>
              <span></span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;