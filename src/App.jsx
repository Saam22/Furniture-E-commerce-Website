import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Products from './components/Products';
import Cart from './components/Cart';
import Newsletter from './components/Newsletter';
import Testimonials from './components/Testimonials';
import ChairDesigner from './components/ChairDesigner';
import VirtualRoom from './components/VirtualRoom';
import OrderTracking from './components/OrderTracking';
import WishlistSlideout from './components/WishlistSlideout';
import CompareSlideout from './components/CompareSlideout';
import ProductGallery from './components/ProductGallery';
import LoyaltyDashboard from './components/LoyaltyDashboard';
import BundlesSection from './components/BundlesSection';
import Footer from './components/Footer';
import { productsData } from './data/productsData';
import { createOrder } from './utils/shippingUtils';
import { addPoints, applyReferralBonus, getPointsBalance } from './data/loyaltyData';

import './App.css';
import './styles/Navbar.css';
import './styles/Hero.css';
import './styles/Products.css';
import './styles/Cart.css';
import './styles/Newsletter.css';
import './styles/Footer.css';
import './styles/animations.css';
import './styles/ChairDesigner.css';
import './styles/VirtualRoom.css';
import './styles/Wishlist.css';
import './styles/Compare.css';
import './styles/ProductGallery.css';
import './styles/Reviews.css';
import './styles/LoyaltyDashboard.css';
import './styles/Bundles.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('furnitureCart');
    if (!savedCart) return [];
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('furnitureOrders');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(o => o && typeof o === 'object' && o.id);
    } catch { return []; }
  });

  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const [orderCount, setOrderCount] = useState(() => {
    const saved = localStorage.getItem('furnitureOrderCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('furnitureTheme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('furnitureWishlist');
    if (!saved) return [];
    try { const p = JSON.parse(saved); return Array.isArray(p) ? p : []; } catch { return []; }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [compareIds, setCompareIds] = useState(() => {
    const saved = localStorage.getItem('furnitureCompare');
    if (!saved) return [];
    try { const p = JSON.parse(saved); return Array.isArray(p) ? p : []; } catch { return []; }
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [galleryProduct, setGalleryProduct] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [pointsTrigger, setPointsTrigger] = useState(0);

  const toggleCompare = (productId) => {
    setCompareIds(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 4) {
        showNotification('يمكن مقارنة 4 منتجات كحد أقصى');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const isInCompare = (productId) => compareIds.includes(productId);

  useEffect(() => {
    localStorage.setItem('furnitureCompare', JSON.stringify(compareIds));
  }, [compareIds]);

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  useEffect(() => {
    localStorage.setItem('furnitureWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wishlistParam = params.get('wishlist');
    if (wishlistParam) {
      const ids = wishlistParam.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
      if (ids.length > 0) {
        setWishlist(ids);
        setIsWishlistOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('furnitureCart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('furnitureOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('furnitureOrderCount', String(orderCount));
  }, [orderCount]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('furnitureTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.pageYOffset > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing
        ? prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
    showNotification('تمت الإضافة للسلة بنجاح');
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
    showNotification('تم حذف المنتج من السلة');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    showNotification('تم تفريغ السلة');
  };

  const handleCheckout = (checkoutInfo) => {
    if (cartItems.length === 0) return;
    const order = createOrder(cartItems, calculateTotal(), checkoutInfo.discountInfo, checkoutInfo.delivery, checkoutInfo.grandTotal);
    setOrders(prev => [...prev, order]);
    setOrderCount(prev => prev + 1);
    setCartItems([]);
    setAppliedCoupon(null);

    const earned = checkoutInfo.earnedPoints || 0;
    if (earned > 0) {
      addPoints(earned, 'نقاط من طلب');
    }
    applyReferralBonus();
    setPointsTrigger(p => p + 1);

    showNotification('تم تأكيد الطلب بنجاح');
    setIsCartOpen(false);
  };

  const handleApplyCoupon = (code) => setAppliedCoupon(code);
  const handleRemoveCoupon = () => setAppliedCoupon(null);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateSavings = () =>
    cartItems.reduce(
      (total, item) => total + (item.originalPrice - item.price) * item.quantity,
      0
    );

  // فلترة بالكاتيجوري + البحث + التقييم
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    const matchesRating = minRating === 0 || product.rating >= minRating;
    return matchesCategory && matchesSearch && matchesRating;
  });

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // لما المستخدم يبحث، نسكرول لقسم المنتجات
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="App">
      <Navbar
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onTrackingClick={() => setIsTrackingOpen(true)}
        orderCount={orderCount}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        wishlistCount={wishlist.length}
        onWishlistClick={() => setIsWishlistOpen(true)}
        compareCount={compareIds.length}
        onCompareClick={() => setIsCompareOpen(true)}
        onLoyaltyClick={() => setIsLoyaltyOpen(true)}
        pointsBalance={getPointsBalance()}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {currentPage === 'home' && (
        <>
          <Hero />

          <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

          <Products
            products={filteredProducts}
            addToCart={addToCart}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            onOpenGallery={setGalleryProduct}
            minRating={minRating}
            onRatingChange={setMinRating}
          />

          <BundlesSection addToCart={addToCart} />
          <Testimonials />
          <Newsletter />
          <Footer />
        </>
      )}

      {currentPage === 'designer' && (
        <ChairDesigner addToCart={addToCart} />
      )}

      {currentPage === 'room' && (
        <VirtualRoom onAddToCart={addToCart} onClose={() => setCurrentPage('home')} />
      )}

      {isCartOpen && (
        <Cart
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
          total={calculateTotal()}
          savings={calculateSavings()}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          orderCount={orderCount}
          onCheckout={handleCheckout}
        />
      )}

      {isTrackingOpen && (
        <>
          <div className="cart-overlay" onClick={() => setIsTrackingOpen(false)}></div>
          <OrderTracking orders={orders} onClose={() => setIsTrackingOpen(false)} />
        </>
      )}

      {isWishlistOpen && (
        <WishlistSlideout
          onClose={() => setIsWishlistOpen(false)}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={(product) => { addToCart(product); setIsWishlistOpen(false); }}
        />
      )}

      {isCompareOpen && (
        <CompareSlideout
          onClose={() => setIsCompareOpen(false)}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
          onAddToCart={(product) => { addToCart(product); setIsCompareOpen(false); }}
        />
      )}

      {galleryProduct && (
        <ProductGallery
          product={galleryProduct}
          onClose={() => setGalleryProduct(null)}
          addToCart={addToCart}
        />
      )}

      {isLoyaltyOpen && (
        <LoyaltyDashboard
          orderCount={orderCount}
          onClose={() => setIsLoyaltyOpen(false)}
        />
      )}

      {showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span>↑</span>
        </button>
      )}

      {notification.show && (
        <div className="notification show">{notification.message}</div>
      )}
    </div>
  );
}

export default App;