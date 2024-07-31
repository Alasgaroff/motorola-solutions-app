import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [editProduct, setEditProduct] = useState(null); // For editing products
  const [updatedProductName, setUpdatedProductName] = useState('');
  const [updatedProductPrice, setUpdatedProductPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
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

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter(product => product.id !== productId));
      setMessage('Product deleted successfully.');
    } catch (error) {
      setMessage('Error deleting product.');
    }
  };

  const handleEdit = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/products/${productId}`, {
        name: updatedProductName,
        price: updatedProductPrice,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.map(product => 
        product.id === productId ? { ...product, name: updatedProductName, price: updatedProductPrice } : product
      ));
      setEditProduct(null);
      setMessage('Product updated successfully.');
    } catch (error) {
      setMessage('Error updating product.');
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      {message && <p>{message}</p>}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {editProduct === product.id ? (
              <div>
                <input 
                  type="text" 
                  value={updatedProductName} 
                  onChange={(e) => setUpdatedProductName(e.target.value)} 
                />
                <input 
                  type="number" 
                  value={updatedProductPrice} 
                  onChange={(e) => setUpdatedProductPrice(e.target.value)} 
                />
                <button onClick={() => handleEdit(product.id)}>Save</button>
                <button onClick={() => setEditProduct(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{product.name} - ${product.price.toFixed(2)}</p>
                <button onClick={() => {
                  setUpdatedProductName(product.name);
                  setUpdatedProductPrice(product.price);
                  setEditProduct(product.id);
                }}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
