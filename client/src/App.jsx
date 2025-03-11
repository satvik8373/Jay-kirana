import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app">
      {isMobile ? (
        <MobileHeader cartItemCount={cartItemCount} />
      ) : (
        <Header cartItemCount={cartItemCount} />
      )}
      <main>
        <Outlet />
      </main>
      <Footer />

      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        main {
          flex: 1;
          padding-top: 64px; /* Header height */
        }

        @media (max-width: 768px) {
          main {
            padding-top: 56px; /* Mobile header height */
          }
        }
      `}</style>
    </div>
  );
}

export default App;