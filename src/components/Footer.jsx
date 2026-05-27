import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialIcons = ['📘', '📷', '🐦', '📺'];
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3>🛋️ الأثاث العصري</h3>
            <p>نقدم لك أفضل تشكيلة من الأثاث العصري والفاخر لمنزل أحلامك</p>
            
            <div className="social-icons">
              {socialIcons.map((icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4>روابط سريعة</h4>
            <ul>
              {['من نحن', 'المنتجات', 'العروض', 'المدونة', 'اتصل بنا'].map((link, index) => (
                <motion.li
                  key={link}
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a href="#">{link}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4>خدمة العملاء</h4>
            <ul>
              {['الشحن والتوصيل', 'الإرجاع والاستبدال', 'الدفع', 'الضمان', 'الأسئلة الشائعة'].map((link, index) => (
                <motion.li
                  key={link}
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a href="#">{link}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="footer-column"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4>تواصل معنا</h4>
            <ul className="contact-info">
              <li>📍 الرياض، المملكة العربية السعودية</li>
              <li>📞 +966 50 123 4567</li>
              <li>✉️ info@furniture.sa</li>
              <li>⏰ السبت - الخميس: 9 ص - 10 م</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>&copy; 2024 الأثاث العصري. جميع الحقوق محفوظة.</p>
          <div className="payment-methods">
            <span>💳</span>
            <span>💰</span>
            <span>🏦</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;