import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Profile from './components/Profile';
import Admin from './pages/Admin';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Orders from './components/admin/Orders';
import Products from './components/admin/Products';
import Users from './components/admin/Users';
import EmailMarketing from './components/EmailMarketing';
import AdminDashboard from './components/admin/AdminDashboard';
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
        element: <AdminRoute><Admin /></AdminRoute>,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'orders', element: <Orders /> },
          { path: 'products', element: <Products /> },
          { path: 'users', element: <Users /> },
          { path: 'email-marketing', element: <EmailMarketing /> }
        ]
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { 
        path: 'cart',
        element: <ProtectedRoute><Cart /></ProtectedRoute>
      },
      {
        path: '*',
        element: <div>Page Not Found</div>
      }
    ]
  }
]);

export default router; 