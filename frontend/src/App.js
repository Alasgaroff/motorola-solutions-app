import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import axios from 'axios';
import './App.css';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app-container">
        <h1>My Motorola Solutions Application</h1>
        {!isAuthenticated && (
          <p className="login-message">You should log in before performing any actions.</p>
        )}
        <nav className="nav-container">
          {!isAuthenticated && (
            <button className="primary-button">
              <Link to="/login">Login</Link>
            </button>
          )}
          {isAuthenticated && (
            <div className="nav-buttons">
              <button className="nav-button">
                <Link to="/orders/new">Place Order</Link>
              </button>
              <button className="nav-button">
                <Link to="/orders">Order List</Link>
              </button>
              <button className="nav-button">
                <Link to="/products/new">Add Product</Link>
              </button>
              <button className="nav-button">
                <Link to="/products">Product List</Link>
              </button>
            </div>
          )}
        </nav>

        <Routes>
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          {isAuthenticated && (
            <>
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/orders/new" element={<OrderForm />} />
              <Route path="/orders" element={<OrderList />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
