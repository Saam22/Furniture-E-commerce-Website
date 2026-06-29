import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import '../styles/Hero.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      title: 'أثاث يخلّي بيتك أهدى وأجمل',
      subtitle: 'قطع مختارة بعناية بتصميم عصري وخامات تعيش معاك سنين.',
      description: 'تسوق غرف معيشة، نوم، طعام وديكور بتجربة بسيطة وسريعة.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=1000&fit=crop',
      buttonText: 'تسوق الآن',
      tag: 'تشكيلة الموسم'
    },
    {
      id: 2,
      title: 'تفاصيل فاخرة بدون مبالغة',
      subtitle: 'تصميمات عملية تناسب البيوت الحديثة والمساحات المختلفة.',
      description: 'خصومات تصل إلى 50% على مجموعة مختارة لفترة محدودة.',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&h=1000&fit=crop',
      buttonText: 'شاهد العروض',
      tag: 'عروض خاصة'
    },
    {
      id: 3,
      title: 'توصيل سريع وتركيب موثوق',
      subtitle: 'نجهز طلبك بعناية ونوصله لباب البيت في الموعد المناسب.',
      description: 'شحن مجاني للطلبات فوق 2000 ج.م وضمان جودة لمدة سنتين.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&h=1000&fit=crop',
      buttonText: 'ابدأ الطلب',
      tag: 'خدمة متكاملة'
    }
  ];

  const stats = [
    { number: '500+', label: 'منتج مختار' },
    { number: '5000+', label: 'عميل سعيد' },
    { number: '50+', label: 'علامة تجارية' },
    { number: '4.8', label: 'تقييم العملاء' }
  ];

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = slides[0].image;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className="hero"
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <div className="hero-background">
              <OptimizedImage
                src={slide.image}
                alt={slide.title}
                width={1600}
                height={1000}
                sizes="100vw"
                priority={index === 0}
                fill
                objectFit="cover"
              />
              <div className="hero-overlay"></div>
            </div>

            <div className="container">
              <div className="hero-content">
                <div className="hero-text">
                  <span className="hero-tag">{slide.tag}</span>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <p className="hero-description">{slide.description}</p>

                  <div className="hero-buttons">
                    <a className="btn btn-primary" href="#products">
                      <span>{slide.buttonText}</span>
                      <span className="btn-icon">←</span>
                    </a>
                    <a className="btn btn-secondary" href="#products">
                      <span>استكشف المنتجات</span>
                      <span className="btn-icon">↓</span>
                    </a>
                  </div>

                  <div className="hero-features">
                    <div className="feature">
                      <span className="feature-icon">01</span>
                      <div className="feature-text">
                        <h4>شحن مجاني</h4>
                        <p>للطلبات فوق 2000 ج.م</p>
                      </div>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">02</span>
                      <div className="feature-text">
                        <h4>ضمان سنتين</h4>
                        <p>على المنتجات المختارة</p>
                      </div>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">03</span>
                      <div className="feature-text">
                        <h4>دفع آمن</h4>
                        <p>طرق دفع مرنة ومعتمدة</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hero-stats">
                  {stats.map((stat) => (
                    <div key={stat.label} className="stat-card">
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
        <button className="slider-arrow" onClick={prevSlide} aria-label="الشريحة السابقة">›</button>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`الذهاب للشريحة ${index + 1}`}
            />
          ))}
        </div>
        <button className="slider-arrow" onClick={nextSlide} aria-label="الشريحة التالية">‹</button>
      </div>
    </section>
  );
};

export default Hero;
