import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import UserProfile from './components/UserProfile';
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
  return (
    <Router>
      <div>
        <h1>My Application</h1>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
