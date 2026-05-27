import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="newsletter">
      <div className="container">
        <motion.div
          className="newsletter-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="newsletter-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📧
          </motion.div>

          <h2>اشترك في نشرتنا البريدية</h2>
          <p>احصل على آخر العروض والتحديثات مباشرة في بريدك</p>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <motion.input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              whileFocus={{ scale: 1.02 }}
            />
            
            <motion.button
              type="submit"
              className="subscribe-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              اشتراك
            </motion.button>
          </form>

          {subscribed && (
            <motion.div
              className="subscribe-success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ✓ تم الاشتراك بنجاح!
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;