import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      
      <div className="container">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              اكتشف الأناقة في
              <span className="highlight"> كل زاوية</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              أثاث عصري يجمع بين الفخامة والراحة لمنزل أحلامك
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,107,53,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                تسوق الآن
              </motion.button>

              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                استكشف المجموعات
              </motion.button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="stat">
                <h3>500+</h3>
                <p>منتج متنوع</p>
              </div>
              <div className="stat">
                <h3>5000+</h3>
                <p>عميل سعيد</p>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <p>علامة تجارية</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="floating-card card-1"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300" alt="Furniture" />
            </motion.div>

            <motion.div
              className="floating-card card-2"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300" alt="Furniture" />
            </motion.div>

            <motion.div
              className="floating-card card-3"
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            >
              <img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300" alt="Furniture" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span>↓</span>
      </motion.div>
    </section>
  );
};

export default Hero;