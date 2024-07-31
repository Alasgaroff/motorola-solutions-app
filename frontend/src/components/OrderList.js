import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [editOrder, setEditOrder] = useState(null); // For editing orders
  const [updatedCustomerName, setUpdatedCustomerName] = useState('');
  const [updatedProducts, setUpdatedProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setMessage('Error fetching orders.');
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter(order => order.id !== orderId));
      setMessage('Order deleted successfully.');
    } catch (error) {
      setMessage('Error deleting order.');
    }
  };

  const handleEdit = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/orders/${orderId}`, {
        customerName: updatedCustomerName,
        products: updatedProducts,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, customerName: updatedCustomerName, Products: updatedProducts } : order
      ));
      setEditOrder(null);
      setMessage('Order updated successfully.');
    } catch (error) {
      setMessage('Error updating order.');
    }
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p>Customer Name: {editOrder === order.id ? (
              <input 
                type="text" 
                value={updatedCustomerName} 
                onChange={(e) => setUpdatedCustomerName(e.target.value)} 
              />
            ) : order.customerName}</p>
            <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
            <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Updated At: {new Date(order.updatedAt).toLocaleString()}</p>
            <h4>Products:</h4>
            <ul>
              {order.Products.map(product => (
                <li key={product.id}>
                  {product.name} - ${product.price.toFixed(2)} x {product.OrderProduct.quantity}
                </li>
              ))}
            </ul>
            {editOrder === order.id ? (
              <div>
                <button onClick={() => handleEdit(order.id)}>Save</button>
                <button onClick={() => setEditOrder(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <button onClick={() => setEditOrder(order.id)}>Edit</button>
                <button onClick={() => handleDelete(order.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
