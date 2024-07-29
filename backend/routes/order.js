import express from 'express';
import Order from '../models/order.js';
import Product from '../models/product.js';
import OrderProduct from '../models/orderProduct.js';
import { getShippingCost } from '../external/shipping.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { customerName, products, destination } = req.body;
    const order = await Order.create({ customerName, totalAmount: 0 });
    let totalAmount = 0;

    for (const prod of products) {
      const product = await Product.findByPk(prod.productId);
      await OrderProduct.create({ orderId: order.id, productId: product.id, quantity: prod.quantity });
      totalAmount += product.price * prod.quantity;
    }

    const shippingCost = await getShippingCost(5, destination); // Assuming a fixed weight for simplicity
    totalAmount += shippingCost;

    order.totalAmount = totalAmount;
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: {
          model: Product,
          through: { attributes: ['quantity'] }
        }
      });
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.update(req.body);
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
