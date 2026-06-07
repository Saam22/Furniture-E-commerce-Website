import { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css';

const Navbar = ({
  cartItemsCount,
  onCartClick,
  onToggleDarkMode,
  isDarkMode,
  searchQuery,
  onSearch,
  onTrackingClick,
  orderCount,
  currentPage,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        onSearch('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch]);

  const handleNavClick = (id) => {
    if (id === 'designer') { onNavigate('designer'); }
    else if (id === 'room') { onNavigate('room'); }
    else {
      if (currentPage !== 'home') onNavigate('home');
      if (id === 'products' || id === 'offers') {
        setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 50);
      } else if (id === 'about') {
        setTimeout(() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }), 50);
      } else if (id === 'contact') {
        setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', name: 'الرئيسية' },
    { id: 'products', name: 'المنتجات' },
    { id: 'offers', name: 'العروض' },
    { id: 'designer', name: 'صمم قطعتك' },
    { id: 'room', name: 'صمم غرفتك 🪄' },
    { id: 'about', name: 'آراء العملاء' },
    { id: 'contact', name: 'تواصل معنا' },
  ];

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => {
      if (prev) onSearch('');
      return !prev;
    });
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <button className="logo" onClick={handleLogoClick} aria-label="العودة للرئيسية">
            <span className="logo-mark">MF</span>
            <div className="logo-text">
              <h1>الأثاث العصري</h1>
              <p>Modern Furniture</p>
            </div>
          </button>

          {currentPage !== 'home' && (
            <button className="back-home-btn" onClick={() => onNavigate('home')}>
              ← الرئيسية
            </button>
          )}

          <div className={`search-bar-wrapper ${isSearchOpen ? 'open' : ''}`}>
            <div className="search-bar">
              <span className="search-icon-inline">⌕</span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث عن أثاث..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                aria-label="بحث في المنتجات"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => onSearch('')}
                  aria-label="مسح البحث"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''} ${isSearchOpen ? 'search-mode' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  className={`nav-link-btn ${currentPage === link.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              className={`icon-btn search-toggle-btn ${isSearchOpen ? 'active' : ''}`}
              onClick={handleSearchToggle}
              title="بحث"
              aria-label="فتح البحث"
            >
              <span>{isSearchOpen ? '×' : '⌕'}</span>
              {searchQuery && !isSearchOpen && (
                <span className="search-active-dot" />
              )}
            </button>

            <button
              className="icon-btn theme-btn"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
              aria-label="تبديل الوضع"
            >
              <span>{isDarkMode ? '☀' : '☾'}</span>
            </button>

            {orderCount > 0 && (
              <button
                className="icon-btn tracking-btn"
                onClick={onTrackingClick}
                title="تتبع الطلبات"
                aria-label="تتبع الطلبات"
              >
                <span>📦</span>
              </button>
            )}

            <button
              className="icon-btn cart-btn"
              onClick={onCartClick}
              title="السلة"
              aria-label="السلة"
            >
              <span>◱</span>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>

            <button
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="فتح القائمة"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <div className={`mobile-search-bar ${isSearchOpen ? 'open' : ''}`}>
          <span className="search-icon-inline">⌕</span>
          <input
            type="text"
            placeholder="ابحث عن أثاث..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="بحث في المنتجات"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearch('')}
              aria-label="مسح البحث"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;