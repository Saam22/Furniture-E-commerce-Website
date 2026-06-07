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
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // فوكس أوتوماتيك لما السيرش يفتح
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // إغلاق السيرش بـ Escape
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

  const navLinks = [
    { id: 'home', name: 'الرئيسية', href: '#home' },
    { id: 'products', name: 'المنتجات', href: '#products' },
    { id: 'offers', name: 'العروض', href: '#products' },
    { id: 'designer', name: 'صمم قطعتك', href: '#furniture-designer' },
    { id: 'about', name: 'آراء العملاء', href: '#testimonials' },
    { id: 'contact', name: 'تواصل معنا', href: '#contact' },
  ];

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => {
      if (prev) onSearch(''); // مسح البحث عند الإغلاق
      return !prev;
    });
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <a className="logo" href="#home" aria-label="العودة للرئيسية">
            <span className="logo-mark">MF</span>
            <div className="logo-text">
              <h1>الأثاث العصري</h1>
              <p>Modern Furniture</p>
            </div>
          </a>

          {/* شريط البحث — يظهر فوق الروابط */}
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
            {/* زرار البحث */}
            <button
              className={`icon-btn search-toggle-btn ${isSearchOpen ? 'active' : ''}`}
              onClick={handleSearchToggle}
              title="بحث"
              aria-label="فتح البحث"
            >
              <span>{isSearchOpen ? '×' : '⌕'}</span>
              {searchQuery && !isSearchOpen && (
                <span className="search-active-dot" aria-hidden="true" />
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

        {/* سيرش بار للموبايل — تحت الناف */}
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