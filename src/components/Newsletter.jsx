import React, { useState } from 'react';
import '../styles/Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(''); // '', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setStatus('error');
      setErrorMessage('الرجاء إدخال اسمك');
      return;
    }

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('الرجاء إدخال بريدك الإلكتروني');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setName('');
      
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }, 1500);
  };

  const benefits = [
    {
      icon: '🎁',
      title: 'عروض حصرية',
      description: 'احصل على خصومات خاصة للمشتركين فقط'
    },
    {
      icon: '🆕',
      title: 'منتجات جديدة',
      description: 'كن أول من يعرف عن المنتجات الجديدة'
    },
    {
      icon: '💰',
      title: 'خصومات خاصة',
      description: 'وفر حتى 30% على مشترياتك'
    },
    {
      icon: '📱',
      title: 'نصائح وإرشادات',
      description: 'احصل على نصائح لتنسيق منزلك'
    }
  ];

  return (
    <section className="newsletter-section">
      <div className="newsletter-background">
        <div className="newsletter-shape shape-1"></div>
        <div className="newsletter-shape shape-2"></div>
        <div className="newsletter-shape shape-3"></div>
      </div>

      <div className="container">
        <div className="newsletter-wrapper">
          <div className="newsletter-content">
            <div className="newsletter-header">
              <div className="newsletter-icon-wrapper">
                <span className="newsletter-icon">📧</span>
                <div className="icon-glow"></div>
              </div>
              
              <h2 className="newsletter-title">
                اشترك في نشرتنا البريدية
              </h2>
              
              <p className="newsletter-description">
                احصل على آخر العروض والخصومات الحصرية مباشرة في بريدك الإلكتروني
              </p>
            </div>

            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    className={status === 'error' && !name ? 'error' : ''}
                  />
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    className={status === 'error' && !validateEmail(email) ? 'error' : ''}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`subscribe-btn ${status}`}
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' && (
                  <>
                    <span className="loading-spinner"></span>
                    <span>جاري الاشتراك...</span>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <span>✓</span>
                    <span>تم الاشتراك بنجاح!</span>
                  </>
                )}
                {status !== 'loading' && status !== 'success' && (
                  <>
                    <span>اشترك الآن</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              {status === 'error' && errorMessage && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {status === 'success' && (
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  <span>شكراً لك! تم الاشتراك بنجاح في نشرتنا البريدية</span>
                </div>
              )}
            </form>

            <div className="newsletter-benefits">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <span className="benefit-icon">{benefit.icon}</span>
                  <div className="benefit-content">
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="newsletter-footer">
              <p className="privacy-text">
                <span className="lock-icon">🔒</span>
                نحترم خصوصيتك. لن نشارك بياناتك مع أي طرف ثالث
              </p>
              <div className="subscriber-count">
                <span className="count-icon">👥</span>
                <span>انضم إلى أكثر من <strong>10,000</strong> مشترك</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;