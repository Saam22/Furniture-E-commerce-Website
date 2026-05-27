import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Products from './components/Products';
import Cart from './components/Cart';
import Newsletter from './components/Newsletter';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { productsData } from './data/productsData';

import './App.css';
import './styles/Navbar.css';
import './styles/Hero.css';
import './styles/Products.css';
import './styles/Cart.css';
import './styles/Newsletter.css';
import './styles/Footer.css';
import './styles/animations.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    const savedCart = localStorage.getItem('furnitureCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('furnitureCart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showNotification('تمت زيادة الكمية في السلة ✓');
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      showNotification('تمت الإضافة للسلة بنجاح ✓');
    }
    
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
    showNotification('تم حذف المنتج من السلة');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    showNotification('تم تفريغ السلة');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => 
      total + ((item.originalPrice - item.price) * item.quantity), 0
    );
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = selectedCategory === 'all'
    ? productsData
    : productsData.filter(product => product.category === selectedCategory);

  return (
    <div className="App">
      <Navbar 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <Hero />
      
      <Categories 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <Products 
        products={filteredProducts}
        addToCart={addToCart}
      />
      
      <Testimonials />
      
      <Newsletter />
      
      <Footer />

      {isCartOpen && (
        <Cart
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
          total={calculateTotal()}
          savings={calculateSavings()}
        />
      )}

      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <span>↑</span>
        </button>
      )}

      {notification.show && (
        <div className="notification show">
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;