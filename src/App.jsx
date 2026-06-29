import { useState, useEffect, useRef, useCallback } from 'react';
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
import BundlesPage from './components/BundlesPage';
import OffersPage from './components/OffersPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import { productsData } from './data/productsData';
import { createOrder as createLocalOrder } from './utils/shippingUtils';
import { addPoints, applyReferralBonus, getPointsBalance } from './data/loyaltyData';

import { AuthProvider, useAuth, setAuthListeners } from './components/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import { fetchCart, addToCartApi, removeFromCartApi, updateCartItemApi, clearCartApi } from './utils/cartApi';
import { fetchWishlist, toggleWishlistApi } from './utils/wishlistApi';
import { getServerProductMap, findServerId, toFrontendCartItems } from './utils/productMap';
import { createOrderApi, fetchOrdersApi, cancelOrderApi } from './utils/orderApi';
import { fetchLoyaltyInfo } from './utils/loyaltyApi';

import './App.css';
import './styles/OptimizedImage.css';
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
import './styles/OffersPage.css';
import './styles/Auth.css';
import './styles/Admin.css';

function AppContent() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const productMapRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('furnitureCurrentPage');
    return saved || 'home';
  });

  const setCurrentPagePersisted = useCallback((page) => {
    setCurrentPage(page);
    localStorage.setItem('furnitureCurrentPage', page);
  }, []);

  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  useEffect(() => {
    setAuthListeners(
      () => {},
      () => { if (currentPageRef.current === 'admin') setCurrentPagePersisted('home'); }
    );
  }, [setCurrentPagePersisted]);

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('furnitureCart');
    if (!savedCart) return [];
    try { return JSON.parse(savedCart); } catch { return []; }
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
      return Array.isArray(parsed) ? parsed.filter(o => o && typeof o === 'object' && o.id) : [];
    } catch { return []; }
  });

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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [pointsTrigger, setPointsTrigger] = useState(0);

  const prevUserRef = useRef(user);

  const showNotification = useCallback((message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  }, []);

  const getServerId = useCallback(async (frontendProduct) => {
    if (!productMapRef.current) {
      productMapRef.current = await getServerProductMap();
    }
    return productMapRef.current?.get(frontendProduct.name) || null;
  }, []);

  useEffect(() => {
    const prev = prevUserRef.current;
    prevUserRef.current = user;

    if (user && !prev) {
      const doSync = async () => {
        productMapRef.current = await getServerProductMap();
        try {
          const sc = await fetchCart();
          const converted = toFrontendCartItems(sc, productsData);
          setCartItems(converted);
          localStorage.setItem('furnitureCart', JSON.stringify(converted));
        } catch { }
        try {
          const wishlistData = await fetchWishlist();
          const map = productMapRef.current;
          const wishlistIds = wishlistData.map(p => p._id);
          const frontendIds = productsData
            .filter(fp => wishlistIds.some(sid => sid === map?.get(fp.name)))
            .map(fp => fp.id);
          setWishlist(frontendIds);
          localStorage.setItem('furnitureWishlist', JSON.stringify(frontendIds));
        } catch { }
        try {
          const { orders: serverOrders } = await fetchOrdersApi();
          if (serverOrders?.length) {
            setOrders(prev => {
              const localIds = new Set(prev.map(o => o.id));
              const merged = [...prev];
              for (const so of serverOrders) {
                const mapped = toFrontendOrder(so);
                if (!localIds.has(mapped.id)) {
                  merged.push(mapped);
                  localIds.add(mapped.id);
                }
              }
              localStorage.setItem('furnitureOrders', JSON.stringify(merged));
              return merged;
            });
          }
        } catch { }
        try {
          const li = await fetchLoyaltyInfo();
          if (li.points !== undefined) {
            localStorage.setItem('furniturePoints', String(li.points));
          }
        } catch { }
      };
      doSync();
    } else if (!user && prev) {
      setCartItems([]);
      setWishlist([]);
      setOrders([]);
      setOrderCount(0);
      localStorage.removeItem('furnitureCart');
      localStorage.removeItem('furnitureWishlist');
      localStorage.removeItem('furnitureOrders');
      localStorage.removeItem('furnitureOrderCount');
    }
  }, [user]);

  const addToCart = useCallback(async (product) => {
    if (isLoggedIn) {
      try {
        const sid = await getServerId(product);
        if (sid) await addToCartApi(sid);
      } catch { }
    }
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const updated = existing
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
      localStorage.setItem('furnitureCart', JSON.stringify(updated));
      return updated;
    });
    showNotification('تمت الإضافة للسلة بنجاح');
    setIsCartOpen(true);
  }, [isLoggedIn, getServerId, showNotification]);

  const removeFromCart = useCallback(async (productId) => {
    if (isLoggedIn) {
      const fp = productsData.find(p => p.id === productId);
      if (fp) {
        const sid = await getServerId(fp);
        if (sid) try { await removeFromCartApi(sid); } catch { }
      }
    }
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      localStorage.setItem('furnitureCart', JSON.stringify(updated));
      return updated;
    });
    showNotification('تم حذف المنتج من السلة');
  }, [isLoggedIn, getServerId, showNotification]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    if (isLoggedIn) {
      const fp = productsData.find(p => p.id === productId);
      if (fp) {
        const sid = await getServerId(fp);
        if (sid) try { await updateCartItemApi(sid, newQuantity); } catch { }
      }
    }
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('furnitureCart', JSON.stringify(updated));
      return updated;
    });
  }, [isLoggedIn, getServerId, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      try { await clearCartApi(); } catch { }
    }
    setCartItems([]);
    localStorage.removeItem('furnitureCart');
    showNotification('تم تفريغ السلة');
  }, [isLoggedIn, showNotification]);

  const toggleWishlist = useCallback(async (productId) => {
    if (isLoggedIn) {
      const fp = productsData.find(p => p.id === productId);
      if (fp) {
        const sid = await getServerId(fp);
        if (sid) {
          try {
            await toggleWishlistApi(sid);
          } catch { }
        }
      }
    }
    setWishlist(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('furnitureWishlist', JSON.stringify(updated));
      return updated;
    });
  }, [isLoggedIn, getServerId]);

  const isInWishlist = (productId) => wishlist.includes(productId);

  useEffect(() => {
    localStorage.setItem('furnitureCart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('furnitureWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('furnitureOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('furnitureOrderCount', String(orderCount));
  }, [orderCount]);

  useEffect(() => {
    localStorage.setItem('furnitureCompare', JSON.stringify(compareIds));
  }, [compareIds]);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wishlistParam = params.get('wishlist');
    if (wishlistParam) {
      const ids = wishlistParam.split(',').map(Number).filter(n => !isNaN(n) && n > 0);
      if (ids.length > 0) { setWishlist(ids); setIsWishlistOpen(true); }
    }
  }, []);

  function toFrontendOrder(so) {
    return {
      id: so._id,
      orderId: so.orderId || so._id.slice(-8).toUpperCase(),
      items: (so.items || []).map(i => ({
        id: i.product?._id || i.product || i.name,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image || '',
      })),
      total: so.grandTotal || 0,
      subtotal: so.subtotal || 0,
      shipping: so.shipping?.cost || 0,
      discount: so.discounts?.totalDiscount || 0,
      status: so.status || 'pending',
      date: so.createdAt ? new Date(so.createdAt).toISOString() : new Date().toISOString(),
      delivery: so.shipping ? {
        zoneId: so.shipping.zoneId,
        city: so.shipping.city,
        express: so.shipping.express,
        cost: so.shipping.cost,
        freeShipping: so.shipping.cost === 0,
        eta: so.shipping.eta,
        address: so.shipping.address || '',
        phone: so.shipping.phone || '',
      } : null,
      pointsEarned: so.pointsEarned || 0,
      couponCode: so.discounts?.coupon?.code || null,
      couponCodeDiscount: so.discounts?.coupon?.amount || 0,
    };
  }

  const toggleCompare = (productId) => {
    setCompareIds(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 4) { showNotification('يمكن مقارنة 4 منتجات كحد أقصى'); return prev; }
      return [...prev, productId];
    });
  };

  const isInCompare = (productId) => compareIds.includes(productId);

  const handleCheckout = async (checkoutInfo) => {
    if (cartItems.length === 0) return;

    const localOrder = createLocalOrder(cartItems, calculateTotal(), checkoutInfo.discountInfo, checkoutInfo.delivery, checkoutInfo.grandTotal);

    if (isLoggedIn) {
      try {
        const serverOrder = await createOrderApi({
          shipping: {
            zoneId: checkoutInfo.delivery.zoneId,
            city: checkoutInfo.delivery.city,
            express: checkoutInfo.delivery.express || false,
            address: checkoutInfo.delivery.address || '',
            phone: checkoutInfo.delivery.phone || '',
          },
          paymentMethod: 'cod',
          couponCode: appliedCoupon || undefined,
        });
        localOrder.id = serverOrder._id;
        localOrder.orderId = serverOrder.orderId;
        localOrder.pointsEarned = serverOrder.pointsEarned || 0;
      } catch (err) {
        showNotification('فشل إنشاء الطلب: ' + err.message);
        return;
      }
    }

    setOrders(prev => [...prev, localOrder]);
    setOrderCount(prev => prev + 1);
    setCartItems([]);
    localStorage.removeItem('furnitureCart');
    setAppliedCoupon(null);

    if (isLoggedIn) {
      clearCartApi().catch(() => {});
    } else {
      const earned = checkoutInfo.earnedPoints || 0;
      if (earned > 0) addPoints(earned, 'نقاط من طلب');
      applyReferralBonus();
    }
    setPointsTrigger(p => p + 1);

    showNotification('تم تأكيد الطلب بنجاح');
    setIsCartOpen(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (!orderId) return;
    const isServerOrder = /^[a-f\d]{24}$/i.test(orderId);
    try {
      if (isLoggedIn && isServerOrder) {
        await cancelOrderApi(orderId);
      }
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: 'cancelled' } : o
        )
      );
      showNotification('تم إلغاء الطلب');
    } catch (err) {
      showNotification('فشل إلغاء الطلب: ' + err.message);
    }
  };

  const handleApplyCoupon = (code) => setAppliedCoupon(code);
  const handleRemoveCoupon = () => setAppliedCoupon(null);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateSavings = () =>
    cartItems.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0);

  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    const matchesRating = minRating === 0 || product.rating >= minRating;
    return matchesCategory && matchesSearch && matchesRating;
  });

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const productsSection = document.getElementById('products');
      if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };
  const openRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };
  const closeAuth = () => { setIsLoginOpen(false); setIsRegisterOpen(false); };
  const switchToRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };
  const switchToLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };

  return (
    <div className="App">
      <Navbar
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onTrackingClick={() => trackingRef.current?.scrollIntoView({ behavior: 'smooth' })}
        orderCount={orderCount}
        currentPage={currentPage}
        onNavigate={setCurrentPagePersisted}
        wishlistCount={wishlist.length}
        onWishlistClick={() => setIsWishlistOpen(true)}
        compareCount={compareIds.length}
        onCompareClick={() => setIsCompareOpen(true)}
        onLoyaltyClick={() => setIsLoyaltyOpen(true)}
        pointsBalance={getPointsBalance()}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
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
          <Testimonials />
          <Newsletter />
          <Footer />
        </>
      )}

      {currentPage === 'designer' && (
        <ChairDesigner addToCart={addToCart} />
      )}

      {currentPage === 'room' && (
        <VirtualRoom onAddToCart={addToCart} onClose={() => setCurrentPagePersisted('home')} />
      )}

      {currentPage === 'offers' && (
        <OffersPage addToCart={addToCart} />
      )}

      {currentPage === 'bundles' && (
          <BundlesPage addToCart={addToCart} />
        )}

        {currentPage === 'admin' && (
          <AdminPage onClose={() => setCurrentPagePersisted('home')} />
        )}

        {currentPage === 'tracking' && (
          <OrderTracking orders={orders} onCancelOrder={handleCancelOrder} />
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
          user={user}
          onLoginClick={openLogin}
        />
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
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span>↑</span>
        </button>
      )}

      {notification.show && (
        <div className="notification show">{notification.message}</div>
      )}

      {isLoginOpen && (
        <Login onSwitch={switchToRegister} onClose={closeAuth} />
      )}

      {isRegisterOpen && (
        <Register onSwitch={switchToLogin} onClose={closeAuth} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
