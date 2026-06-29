import { useState, useEffect, useRef } from 'react';
import { categories } from '../data/productsData';
import { useAuth } from './AuthContext';
import '../styles/Navbar.css';

const NAV_ICONS = {
  home: '⌂',
  products: '▣',
  offers: '🔥',
  designer: '🪑',
  room: '✦',
  bundles: '📦',
  about: '★',
  contact: '✉',
};

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
  wishlistCount,
  onWishlistClick,
  compareCount,
  onCompareClick,
  onLoyaltyClick,
  pointsBalance,
  selectedCategory,
  onSelectCategory,
  onLoginClick,
  onRegisterClick,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const searchInputRef = useRef(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);
      if (currentY > 120) {
        setIsHidden(currentY > lastScrollY);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const sections = ['home', 'products', 'bundles', 'testimonials', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'testimonials') setActiveSection('about');
          else setActiveSection(id);
        }
      });
    }, { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    if (id === 'designer' || id === 'room' || id === 'offers' || id === 'bundles') {
      onNavigate(id);
    } else {
      if (currentPage !== 'home') onNavigate('home');
      const targetId = id === 'about' ? 'testimonials' : id;
      setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const isActive = (id) => {
    if (id === 'home' && activeSection === 'home' && currentPage === 'home') return true;
    if (id === 'products' && (activeSection === 'products' || selectedCategory !== 'all')) return true;
    if (id === 'about' && activeSection === 'about') return true;
    if (id === activeSection && currentPage === 'home') return true;
    return false;
  };

  const navLinks = [
    { id: 'home', name: 'الرئيسية' },
    { id: 'products', name: 'المنتجات' },
    { id: 'offers', name: 'العروض' },
    { id: 'room', name: 'صمم غرفتك' },
    { id: 'about', name: 'آراء العملاء' },
    { id: 'contact', name: 'تواصل معنا' },
  ];

  const moreActions = [
    { id: 'loyalty', icon: '✦', label: 'برنامج الولاء', onClick: () => { onLoyaltyClick(); setShowMoreMenu(false); }, badge: pointsBalance > 0 ? pointsBalance : null },
    { id: 'compare', icon: '⚖️', label: 'المقارنة', onClick: () => { onCompareClick(); setShowMoreMenu(false); }, badge: compareCount > 0 ? compareCount : null },
    { id: 'designer', icon: '✎', label: 'صمم قطعتك', onClick: () => { handleNavClick('designer'); setShowMoreMenu(false); } },
    { id: 'bundles', icon: '⊞', label: 'الحزم الموفرة', onClick: () => { handleNavClick('bundles'); setShowMoreMenu(false); } },
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isHidden ? 'hidden' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <button className="logo" onClick={handleLogoClick} aria-label="العودة للرئيسية">
              <span className="logo-mark">MF</span>
              <div className="logo-text">
                <h1>الأثاث العصري</h1>
                <p>Modern Furniture</p>
              </div>
            </button>

            <div className="nav-center">
              <ul className="nav-links">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      className={`nav-link-btn ${currentPage === link.id || (currentPage === 'home' && isActive(link.id)) ? 'active' : ''}`}
                      onClick={() => handleNavClick(link.id)}
                    >
                      <span className="nav-link-icon">{NAV_ICONS[link.id]}</span>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-actions">
              <button
                className={`icon-btn search-toggle-btn ${isScrolled ? 'show' : ''}`}
                onClick={() => searchInputRef.current?.focus()}
                title="بحث"
                aria-label="بحث"
              >
                <span>⌕</span>
              </button>

              <div className="nav-search-desktop">
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
                  <button className="search-clear-btn" onClick={() => onSearch('')}>×</button>
                )}
              </div>

              {user ? (
                <div className="user-menu-container" ref={userMenuRef}>
                  <button
                    className="icon-btn user-btn"
                    onClick={() => setShowUserMenu(p => !p)}
                    title="حسابي"
                  >
                    <span>👤</span>
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <span className="user-dropdown-name">{user.name}</span>
                        <span className="user-dropdown-email">{user.email}</span>
                      </div>
                      {user?.role === 'admin' && (
                        <button className="user-dropdown-item" onClick={() => { onNavigate('admin'); setShowUserMenu(false); }}>
                          <span>⚙️</span>
                          <span>لوحة الإدارة</span>
                        </button>
                      )}
                      <button className="user-dropdown-item" onClick={() => { onNavigate('tracking'); setShowUserMenu(false); }}>
                        <span>📦</span>
                        <span>تتبع الطلبات</span>
                      </button>
                      <button className="user-dropdown-item" onClick={() => { logout(); setShowUserMenu(false); }}>
                        <span>🚪</span>
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="auth-btn login-btn" onClick={onLoginClick}>
                    تسجيل الدخول
                  </button>
                  <button className="auth-btn register-btn" onClick={onRegisterClick}>
                    إنشاء حساب
                  </button>
                </>
              )}

              <button
                className="icon-btn theme-btn"
                onClick={onToggleDarkMode}
                title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
              >
                <span>{isDarkMode ? '☀' : '☾'}</span>
              </button>

              <div className="more-menu-container" ref={moreMenuRef}>
                <button
                  className="icon-btn more-btn"
                  onClick={() => setShowMoreMenu(p => !p)}
                  title="المزيد"
                >
                  <span>···</span>
                </button>
                {showMoreMenu && (
                  <div className="more-dropdown">
                    {moreActions.map(action => (
                      <button key={action.id} className="more-dropdown-item" onClick={action.onClick}>
                        <span>{action.icon}</span>
                        <span>{action.label}</span>
                        {action.badge && <span className="more-badge">{action.badge}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="icon-btn cart-btn"
                onClick={onCartClick}
                title="السلة"
              >
                <span>◱</span>
                {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
              </button>

              <button
                className="icon-btn wishlist-btn"
                onClick={onWishlistClick}
                title="المفضلة"
              >
                <span>{wishlistCount > 0 ? '❤️' : '🤍'}</span>
                {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
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
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">القائمة</span>
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
          </div>

          <div className="mobile-search-area">
            <span className="search-icon-inline">⌕</span>
            <input
              type="text"
              placeholder="ابحث عن أثاث..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="بحث في المنتجات"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => onSearch('')}>×</button>
            )}
          </div>

          <div className="mobile-nav-links">
            <span className="mobile-nav-section-title">الصفحات</span>
            {navLinks.map((link) => (
              <button
                key={link.id}
                className={`mobile-nav-item ${currentPage === link.id || isActive(link.id) ? 'active' : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                <span className="mobile-nav-item-icon">{NAV_ICONS[link.id]}</span>
                <span>{link.name}</span>
              </button>
            ))}
            <button
              className={`mobile-nav-item ${currentPage === 'designer' ? 'active' : ''}`}
              onClick={() => handleNavClick('designer')}
            >
              <span className="mobile-nav-item-icon">{NAV_ICONS['designer']}</span>
              <span>صمم قطعتك</span>
            </button>
            <button
              className={`mobile-nav-item ${currentPage === 'bundles' ? 'active' : ''}`}
              onClick={() => handleNavClick('bundles')}
            >
              <span className="mobile-nav-item-icon">{NAV_ICONS['bundles']}</span>
              <span>الحزم الموفرة</span>
            </button>
          </div>

          <div className="mobile-nav-links">
            <span className="mobile-nav-section-title">الفئات</span>
            <button
              className={`mobile-nav-item ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => { onSelectCategory('all'); setIsMobileMenuOpen(false); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <span className="mobile-nav-item-icon">⌂</span>
              <span>الكل</span>
            </button>
            {categories.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                className={`mobile-nav-item ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => { onSelectCategory(cat.id); setIsMobileMenuOpen(false); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                <span className="mobile-nav-item-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="mobile-nav-links">
            <span className="mobile-nav-section-title">الحساب</span>
            {user ? (
              <>
                <div className="mobile-user-info">
                  <span>{user.name}</span>
                  <span className="mobile-user-email">{user.email}</span>
                </div>
                {user?.role === 'admin' && (
                  <button className="mobile-nav-item" onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}>
                    <span className="mobile-nav-item-icon">⚙️</span>
                    <span>لوحة الإدارة</span>
                  </button>
                )}
                <button className="mobile-nav-item" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                  <span className="mobile-nav-item-icon">🚪</span>
                  <span>تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <>
                <button className="mobile-nav-item" onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}>
                  <span className="mobile-nav-item-icon">🔑</span>
                  <span>تسجيل الدخول</span>
                </button>
                <button className="mobile-nav-item" onClick={() => { onRegisterClick(); setIsMobileMenuOpen(false); }}>
                  <span className="mobile-nav-item-icon">➕</span>
                  <span>إنشاء حساب</span>
                </button>
              </>
            )}
          </div>

          <div className="mobile-nav-links">
            <span className="mobile-nav-section-title">الإجراءات</span>
            <button className="mobile-nav-item" onClick={() => { onLoyaltyClick(); setIsMobileMenuOpen(false); }}>
              <span className="mobile-nav-item-icon">✦</span>
              <span>برنامج الولاء</span>
              {pointsBalance > 0 && <span className="mobile-nav-badge">{pointsBalance}</span>}
            </button>
            <button className="mobile-nav-item" onClick={() => { onCompareClick(); setIsMobileMenuOpen(false); }}>
              <span className="mobile-nav-item-icon">⚖️</span>
              <span>المقارنة</span>
              {compareCount > 0 && <span className="mobile-nav-badge">{compareCount}</span>}
            </button>
            <button className="mobile-nav-item" onClick={() => { onToggleDarkMode(); }}>
              <span className="mobile-nav-item-icon">{isDarkMode ? '☀' : '☾'}</span>
              <span>{isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navbar;
