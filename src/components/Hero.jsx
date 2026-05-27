import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      title: 'اكتشف الأناقة في كل زاوية',
      subtitle: 'أثاث عصري يجمع بين الفخامة والراحة لمنزل أحلامك',
      description: 'تشكيلة واسعة من أفضل الماركات العالمية',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop',
      color: '#FF6B35',
      buttonText: 'تسوق الآن',
      tag: 'جديد'
    },
    {
      id: 2,
      title: 'تصاميم فاخرة لمنزل أحلامك',
      subtitle: 'جودة عالية وأسعار تنافسية مع ضمان شامل',
      description: 'خصومات تصل إلى 50% على مجموعة مختارة',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop',
      color: '#004E89',
      buttonText: 'استكشف العروض',
      tag: 'عرض خاص'
    },
    {
      id: 3,
      title: 'راحتك هي أولويتنا',
      subtitle: 'خدمة توصيل سريعة وآمنة لجميع أنحاء المملكة',
      description: 'شحن مجاني للطلبات فوق 1000 ريال',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=800&fit=crop',
      color: '#8B4513',
      buttonText: 'اطلب الآن',
      tag: 'شحن مجاني'
    }
  ];

  const stats = [
    {
      icon: '🛋️',
      number: '500+',
      label: 'منتج متنوع',
      color: '#FF6B35'
    },
    {
      icon: '😊',
      number: '5000+',
      label: 'عميل سعيد',
      color: '#F7B801'
    },
    {
      icon: '🏆',
      number: '50+',
      label: 'علامة تجارية',
      color: '#004E89'
    },
    {
      icon: '⭐',
      number: '4.8',
      label: 'تقييم العملاء',
      color: '#28A745'
    }
  ];

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPaused, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      className="hero" 
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ '--slide-color': slide.color }}
          >
            <div className="hero-background">
              <img src={slide.image} alt={slide.title} loading="lazy" />
              <div className="hero-overlay"></div>
              <div className="hero-pattern"></div>
            </div>

            <div className="container">
              <div className="hero-content">
                <div className="hero-text">
                  <span className="hero-tag">{slide.tag}</span>
                  
                  <h1 className="hero-title">
                    {slide.title}
                  </h1>
                  
                  <p className="hero-subtitle">
                    {slide.subtitle}
                  </p>
                  
                  <p className="hero-description">
                    {slide.description}
                  </p>

                  <div className="hero-buttons">
                    <button className="btn btn-primary">
                      <span>{slide.buttonText}</span>
                      <span className="btn-icon">→</span>
                    </button>
                    <button className="btn btn-secondary">
                      <span>استكشف المزيد</span>
                      <span className="btn-icon">↓</span>
                    </button>
                  </div>

                  <div className="hero-features">
                    <div className="feature">
                      <span className="feature-icon">🚚</span>
                      <div className="feature-text">
                        <h4>شحن مجاني</h4>
                        <p>للطلبات فوق 1000 ر.س</p>
                      </div>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">✓</span>
                      <div className="feature-text">
                        <h4>ضمان الجودة</h4>
                        <p>ضمان لمدة سنتين</p>
                      </div>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">💳</span>
                      <div className="feature-text">
                        <h4>دفع آمن</h4>
                        <p>طرق دفع متعددة</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hero-stats">
                  {stats.map((stat, idx) => (
                    <div 
                      key={idx} 
                      className="stat-card"
                      style={{ '--stat-color': stat.color }}
                    >
                      <span className="stat-icon">{stat.icon}</span>
                      <h3 className="stat-number">{stat.number}</h3>
                      <p className="stat-label">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <button className="slider-arrow prev" onClick={prevSlide}>
          <span>←</span>
        </button>
        
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`الذهاب للشريحة ${index + 1}`}
            />
          ))}
        </div>

        <button className="slider-arrow next" onClick={nextSlide}>
          <span>→</span>
        </button>
      </div>

      <div className="scroll-indicator">
        <span className="scroll-text">انزل لاستكشاف المنتجات</span>
        <span className="scroll-arrow">↓</span>
      </div>

      <div className="hero-decorations">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>
    </section>
  );
};

export default Hero;