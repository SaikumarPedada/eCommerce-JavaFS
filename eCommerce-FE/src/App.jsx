// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import AppNavbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AuthHome from './components/AuthHome';
import CustomerHome from './components/CustomerHome';
import MerchantHome from './components/MerchantHome';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import MyOrders from './components/MyOrders';
import AddProductModal from './components/AddProductModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const App = () => {
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <AuthProvider>
      <Router>
        <AppNavbar
          onMerchantAddProduct={() => setShowMerchantModal(true)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Routes>
          <Route path="/" element={<AuthHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer" element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerHome selectedCategory={selectedCategory} />
            </ProtectedRoute>
          } />
          <Route path="/merchant" element={
            <ProtectedRoute role="MERCHANT">
              <MerchantHome showModal={showMerchantModal} setShowModal={setShowMerchantModal} />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<ProtectedRoute role="CUSTOMER"><Cart /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute role="CUSTOMER"><MyOrders /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
