import { useState } from 'react';
// ✅ احذف: import React, { useState } from 'react';
// ✅ احذف: import { motion } from 'framer-motion';
import '../styles/Footer.css';

const Footer = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const currentYear = new Date().getFullYear();

  const footerData = {
    company: {
      title: 'الشركة',
      links: [
        { name: 'من نحن', href: '#about', icon: '👥' },
        { name: 'فروعنا', href: '#branches', icon: '📍' },
        { name: 'الوظائف', href: '#careers', icon: '💼' },
        { name: 'المدونة', href: '#blog', icon: '📝' },
        { name: 'الأخبار', href: '#news', icon: '📰' }
      ]
    },
    support: {
      title: 'خدمة العملاء',
      links: [
        { name: 'مركز المساعدة', href: '#help', icon: '❓' },
        { name: 'الشحن والتوصيل', href: '#shipping', icon: '🚚' },
        { name: 'الإرجاع والاستبدال', href: '#returns', icon: '↩️' },
        { name: 'الأسئلة الشائعة', href: '#faq', icon: '💬' },
        { name: 'تتبع الطلب', href: '#track', icon: '📦' }
      ]
    },
    shop: {
      title: 'التسوق',
      links: [
        { name: 'غرف معيشة', href: '#living', icon: '🛋️' },
        { name: 'غرف نوم', href: '#bedroom', icon: '🛏️' },
        { name: 'غرم طعام', href: '#dining', icon: '🍽️' },
        { name: 'المكاتب', href: '#office', icon: '💼' },
        { name: 'الديكور', href: '#decor', icon: '🎨' }
      ]
    },
    legal: {
      title: 'معلومات قانونية',
      links: [
        { name: 'الشروط والأحكام', href: '#terms', icon: '📋' },
        { name: 'سياسة الخصوصية', href: '#privacy', icon: '🔒' },
        { name: 'سياسة الاسترجاع', href: '#refund', icon: '💰' },
        { name: 'سياسة الكوكيز', href: '#cookies', icon: '🍪' }
      ]
    }
  };

  const socialMedia = [
    { name: 'Facebook', icon: '📘', href: '#facebook', color: '#1877F2' },
    { name: 'Instagram', icon: '📷', href: '#instagram', color: '#E4405F' },
    { name: 'Twitter', icon: '🐦', href: '#twitter', color: '#1DA1F2' },
    { name: 'YouTube', icon: '📺', href: '#youtube', color: '#FF0000' },
    { name: 'Snapchat', icon: '👻', href: '#snapchat', color: '#FFFC00' },
    { name: 'TikTok', icon: '🎵', href: '#tiktok', color: '#000000' }
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'Mada', icon: '🏦' },
    { name: 'Apple Pay', icon: '📱' },
    { name: 'Cash', icon: '💰' },
    { name: 'Bank Transfer', icon: '🏧' }
  ];

  const contactInfo = [
    {
      icon: '📍',
      title: 'العنوان',
      content: 'الرياض، حي الملك فهد، المملكة العربية السعودية'
    },
    {
      icon: '📞',
      title: 'الهاتف',
      content: '+966 50 123 4567'
    },
    {
      icon: '📱',
      title: 'واتساب',
      content: '+966 50 123 4567'
    },
    {
      icon: '✉️',
      title: 'البريد الإلكتروني',
      content: 'info@furniture.sa'
    },
    {
      icon: '⏰',
      title: 'أوقات العمل',
      content: 'السبت - الخميس: 9 صباحاً - 10 مساءً'
    }
  ];

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <footer className="footer">
      <div className="footer-wave"></div>

      <div className="container">
        {/* Footer Top */}
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-column footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🛋️</span>
              <div className="logo-content">
                <h3>الأثاث العصري</h3>
                <p>Modern Furniture</p>
              </div>
            </div>
            
            <p className="footer-description">
              نقدم لك أفضل تشكيلة من الأثاث العصري والفاخر لمنزل أحلامك.
              جودة عالية، أسعار تنافسية، وخدمة عملاء متميزة على مدار الساعة.
            </p>

            <div className="social-media">
              <h4 className="social-title">تابعنا على</h4>
              <div className="social-links">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="social-btn"
                    style={{ '--social-color': social.color }}
                    title={social.name}
                  >
                    <span>{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="app-download">
              <h4>حمل التطبيق</h4>
              <div className="app-buttons">
                <a href="#appstore" className="app-btn">
                  <span className="app-icon">🍎</span>
                  <div className="app-text">
                    <small>Download on the</small>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="#playstore" className="app-btn">
                  <span className="app-icon">📱</span>
                  <div className="app-text">
                    <small>GET IT ON</small>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key} className="footer-column">
              <h4 
                className="footer-column-title"
                onClick={() => toggleAccordion(key)}
              >
                {section.title}
                <span className={`accordion-icon ${activeAccordion === key ? 'active' : ''}`}>
                  ›
                </span>
              </h4>
              <ul className={`footer-links ${activeAccordion === key ? 'active' : ''}`}>
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>
                      <span className="link-icon">{link.icon}</span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="footer-column footer-contact">
            <h4 className="footer-column-title">تواصل معنا</h4>
            <ul className="contact-list">
              {contactInfo.map((info, index) => (
                <li key={index} className="contact-item">
                  <span className="contact-icon">{info.icon}</span>
                  <div className="contact-content">
                    <strong>{info.title}</strong>
                    <span>{info.content}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Middle */}
        <div className="footer-middle">
          <div className="footer-middle-content">
            <div className="payment-section">
              <h4>طرق الدفع المتاحة</h4>
              <div className="payment-methods">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="payment-method" title={method.name}>
                    <span>{method.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="certifications-section">
              <h4>شهادات الجودة والأمان</h4>
              <div className="certifications">
                <div className="cert-badge">
                  <span className="cert-icon">✓</span>
                  <span>ISO 9001</span>
                </div>
                <div className="cert-badge">
                  <span className="cert-icon">🔒</span>
                  <span>SSL Secure</span>
                </div>
                <div className="cert-badge">
                  <span className="cert-icon">✓</span>
                  <span>معتمد</span>
                </div>
                <div className="cert-badge">
                  <span className="cert-icon">⭐</span>
                  <span>أفضل جودة</span>
                </div>
              </div>
            </div>

            <div className="delivery-section">
              <h4>نوصل لجميع مناطق المملكة</h4>
              <div className="delivery-cities">
                <span className="city-tag">الرياض</span>
                <span className="city-tag">جدة</span>
                <span className="city-tag">الدمام</span>
                <span className="city-tag">مكة</span>
                <span className="city-tag">المدينة</span>
                <span className="city-tag">+15 مدينة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} الأثاث العصري. جميع الحقوق محفوظة.
            </p>
            
            <div className="footer-bottom-links">
              <a href="#privacy">سياسة الخصوصية</a>
              <span className="separator">|</span>
              <a href="#terms">الشروط والأحكام</a>
              <span className="separator">|</span>
              <a href="#sitemap">خريطة الموقع</a>
            </div>

            <p className="developer">
              صُمم وطُور بـ <span className="heart">♥</span> في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="العودة للأعلى"
      >
        <span>↑</span>
      </button>
    </footer>
  );
};

export default Footer;