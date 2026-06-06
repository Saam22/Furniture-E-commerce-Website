import React, { useState, useEffect } from 'react';
import { testimonials } from '../data/productsData';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>آراء عملائنا</h2>
          <p>تجارب حقيقية من ناس اختارت قطعها من الأثاث العصري.</p>
        </div>

        <div className="testimonials-slider">
          <button className="slider-btn" onClick={prevTestimonial} aria-label="الرأي السابق">›</button>

          <div className="testimonial-card">
            <div className="testimonial-avatar">{testimonials[currentIndex].avatar}</div>
            <div className="testimonial-rating">{'★'.repeat(testimonials[currentIndex].rating)}</div>
            <p className="testimonial-comment">"{testimonials[currentIndex].comment}"</p>

            <div className="testimonial-author">
              <h4>{testimonials[currentIndex].name}</h4>
              <p>{new Date(testimonials[currentIndex].date).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>

          <button className="slider-btn" onClick={nextTestimonial} aria-label="الرأي التالي">‹</button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`عرض الرأي ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
