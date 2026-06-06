import React, { useState } from 'react';
import '../styles/Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setStatus('error');
      setErrorMessage('اكتب اسمك من فضلك');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('اكتب بريد إلكتروني صحيح');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setName('');
      setTimeout(() => setStatus(''), 4500);
    }, 900);
  };

  const benefits = [
    { title: 'عروض قبل الجميع', description: 'خصومات مختارة للمشتركين فقط.' },
    { title: 'منتجات جديدة', description: 'تعرف على القطع الجديدة أول ما تنزل.' },
    { title: 'أفكار للبيت', description: 'نصائح بسيطة لتنسيق المساحات.' }
  ];

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-wrapper">
          <div className="newsletter-content">
            <div className="newsletter-header">
              <span className="newsletter-kicker">النشرة البريدية</span>
              <h2 className="newsletter-title">خليك قريب من أحدث العروض</h2>
              <p className="newsletter-description">
                ابعتلنا بريدك وهنوصلك بتحديثات مختصرة عن الخصومات والقطع الجديدة.
              </p>
            </div>

            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>

              <button type="submit" className={`subscribe-btn ${status}`} disabled={status === 'loading' || status === 'success'}>
                {status === 'loading' && 'جاري الاشتراك...'}
                {status === 'success' && 'تم الاشتراك بنجاح'}
                {status !== 'loading' && status !== 'success' && 'اشترك الآن'}
              </button>

              {status === 'error' && errorMessage && <div className="error-message">{errorMessage}</div>}
              {status === 'success' && <div className="success-message">شكرا لك، تم تسجيلك في النشرة البريدية.</div>}
            </form>

            <div className="newsletter-benefits">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="benefit-card">
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
