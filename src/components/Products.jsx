import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const Products = ({ products, addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  
  const categories = ['الكل', 'غرف معيشة', 'غرف نوم', 'غرف طعام', 'مكاتب', 'ديكور'];

  const filteredProducts = selectedCategory === 'الكل'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <section className="products" id="المنتجات">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>منتجاتنا المميزة</h2>
          <p>اكتشف مجموعة واسعة من الأثاث العصري</p>
        </motion.div>

        <motion.div
          className="categories"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="products-grid"
          layout
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;