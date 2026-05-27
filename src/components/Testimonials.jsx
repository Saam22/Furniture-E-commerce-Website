import React, { useState } from 'react';
import { testimonials } from '../data/productsData';
import '../styles/Newsletter.css';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>آراء عملائنا</h2>
          <p>اكتشف تجارب عملائنا السعداء</p>
        </div>

        <div className="testimonials-slider">
          <button className="slider-btn prev" onClick={prevTestimonial}>
            ←
          </button>

          <div className="testimonial-card">
            <div className="testimonial-avatar">
              <span>{testimonials[currentIndex].avatar}</span>
            </div>
            
            <div className="testimonial-rating">
              {renderStars(testimonials[currentIndex].rating)}
            </div>

            <p className="testimonial-comment">
              "{testimonials[currentIndex].comment}"
            </p>

            <div className="testimonial-author">
              <h4>{testimonials[currentIndex].name}</h4>
              <p>{new Date(testimonials[currentIndex].date).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>

          <button className="slider-btn next" onClick={nextTestimonial}>
            →
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;