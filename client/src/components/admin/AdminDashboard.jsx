import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaBox, FaClipboardList, FaUsers, FaSignOutAlt, FaTachometerAlt, FaBars } from 'react-icons/fa';
import AddProduct from './AddProduct';
import Orders from './Orders';
import ManageProducts from './ManageProducts';
import Users from './Users';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path, section) => {
    navigate(path);
    setActiveSection(section);
  };

  const sidebarItems = [
    { icon: FaTachometerAlt, text: 'Dashboard', path: '/admin', section: 'dashboard' },
    { icon: FaBox, text: 'Add Product', path: '/admin/add-product', section: 'add-product' },
    { icon: FaClipboardList, text: 'Manage Products', path: '/admin/manage-products', section: 'manage-products' },
    { icon: FaClipboardList, text: 'Orders', path: '/admin/orders', section: 'orders' },
    { icon: FaUsers, text: 'Users', path: '/admin/users', section: 'users' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex justify-between items-center">
          {!isSidebarCollapsed && <h2 className="text-xl font-semibold">Admin Panel</h2>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded hover:bg-gray-700 transition-colors"
          >
            <FaBars />
          </button>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.section}
              onClick={() => handleNavigation(item.path, item.section)}
              className={`w-full flex items-center p-4 hover:bg-gray-700 transition-colors ${
                activeSection === item.section ? 'bg-gray-700' : ''
              }`}
            >
              <item.icon className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-4'}`} />
              {!isSidebarCollapsed && <span>{item.text}</span>}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 hover:bg-gray-700 transition-colors mt-auto"
          >
            <FaSignOutAlt className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-4'}`} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;