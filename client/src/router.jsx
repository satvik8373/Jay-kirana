import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Profile from './components/Profile';
import Admin from './components/admin/Admin';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/admin/Orders';
import Products from './components/admin/Products';
import Users from './components/admin/Users';
import EmailMarketing from './components/EmailMarketing';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { 
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      { 
        path: 'admin',
        element: <AdminRoute><Admin /></AdminRoute>
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { 
        path: 'cart',
        element: <ProtectedRoute><Cart /></ProtectedRoute>
      },
      { 
        path: 'admin/orders',
        element: <AdminRoute><Orders /></AdminRoute>
      },
      { 
        path: 'admin/products',
        element: <AdminRoute><Products /></AdminRoute>
      },
      { 
        path: 'admin/users',
        element: <AdminRoute><Users /></AdminRoute>
      },
      { 
        path: 'admin/email-marketing',
        element: <AdminRoute><EmailMarketing /></AdminRoute>
      },
      {
        path: '*',
        element: <div>Page Not Found</div>
      }
    ]
  }
]);

export default router; 