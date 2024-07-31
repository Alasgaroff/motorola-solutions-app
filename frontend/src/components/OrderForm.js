import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        setMessage('Error fetching products. Please ensure you are logged in to access this data.');
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = (productId) => {
    setSelectedProducts([...selectedProducts, { productId, quantity }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/orders', {
        customerName,
        products: selectedProducts,
        destination
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Order placed successfully!');
    } catch (error) {
      setMessage('Error placing order.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />
      <select
        onChange={(e) => handleAddProduct(e.target.value)}
        value=""
      >
        <option value="" disabled>Select Product</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>{product.name}</option>
        ))}
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />
      <button type="submit">Place Order</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default OrderForm;
