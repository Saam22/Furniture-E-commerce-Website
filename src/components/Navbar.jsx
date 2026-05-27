import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = ({ cartItemsCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', name: 'الرئيسية', href: '#home' },
    { id: 'products', name: 'المنتجات', href: '#products' },
    { id: 'offers', name: 'العروض', href: '#offers' },
    { id: 'about', name: 'من نحن', href: '#about' },
    { id: 'contact', name: 'اتصل بنا', href: '#contact' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">🛋️</span>
            <div className="logo-text">
              <h1>الأثاث العصري</h1>
              <p>Modern Furniture</p>
            </div>
          </div>

          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a 
                  href={link.href}
                  className={activeLink === link.id ? 'active' : ''}
                  onClick={() => {
                    setActiveLink(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="icon-btn search-btn" title="بحث">
              <span>🔍</span>
            </button>

            <button 
              className="icon-btn cart-btn" 
              onClick={onCartClick}
              title="السلة"
            >
              <span>🛒</span>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>

            <button className="icon-btn user-btn" title="حسابي">
              <span>👤</span>
            </button>

            <button
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;