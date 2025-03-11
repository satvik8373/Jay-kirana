import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Profile from './components/Profile';
import './index.css';

// NotFound component for 404 pages
const NotFound = () => (
  <div className="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/">Go back to home</a>
    
    <style jsx>{`
      .not-found {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        text-align: center;
        background: #f5f5f5;
      }
      h1 {
        color: #1a237e;
        margin-bottom: 20px;
      }
      p {
        color: #666;
        margin-bottom: 20px;
      }
      a {
        color: #1a237e;
        text-decoration: none;
        padding: 10px 20px;
        border: 2px solid #1a237e;
        border-radius: 5px;
        transition: all 0.3s ease;
      }
      a:hover {
        background: #1a237e;
        color: white;
      }
    `}</style>
  </div>
);

function ProtectedRoute({ children, requireAdmin }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
        <style jsx>{`
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 1.2rem;
            color: #1a237e;
          }
        `}</style>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
}

function App() {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(cart.map(item =>
      item._id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {isMobile ? (
            <MobileHeader cartItemCount={cartItemCount} />
          ) : (
            <Header cartItemCount={cartItemCount} />
          )}
          <main>
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart 
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                </ProtectedRoute>
              } />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout cart={cart} onCheckout={clearCart} />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;