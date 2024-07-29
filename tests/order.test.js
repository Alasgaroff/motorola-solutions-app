import request from 'supertest';
import { app, server } from '../index.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import sequelize from '../models/index.js';

let authToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const res = await request(app)
    .post('/login')
    .send({ username: 'testuser' });
  
  authToken = res.body.token;

  await Product.create({ name: 'Test Product', price: 10.0 });
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Order API', () => {
  let product;

  beforeEach(async () => {
    product = await Product.create({ name: 'Test Product', price: 10.0 });
  });

  afterEach(async () => {
    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });
  });

  it('should create an order with valid products', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customerName: 'Kai Alasga',
        products: [
          { productId: product.id, quantity: 2 },
          { productId: 1, quantity: 5 }
        ],
        destination: '457 Main St, Anytown, USA'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.customerName).toBe('Kai Alasga');
    expect(res.body.totalAmount).toBeGreaterThan(0);
  });

  it('should return 400 for an order with invalid product IDs', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customerName: 'Kai Alasga',
        products: [{ productId: 9999, quantity: 2 }],
        destination: '457 Main St, Anytown, USA'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBeDefined();
  });

  it('should get all orders and validate related products', async () => {
     await Order.create({
      customerName: 'Jane Doe',
      totalAmount: 30.0,
      destination: '123 Main St, Anytown, USA',
      Products: [{ productId: product.id, quantity: 3 }, { productId: product.id, quantity: 1 }] 
    }, {
    });

    const res = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('Products');
  });

  it('should update an order with valid data', async () => {
    const order = await Order.create({
      customerName: 'Jane Doe',
      totalAmount: 30.0,
      destination: '123 Main St, Anytown, USA',
      Products: [{ id: product.id, quantity: 3 }]
    }, {
    });

    const res = await request(app)
      .put(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customerName: 'Jane Smith',
        totalAmount: 40.0,
        destination: '456 Another St, Anytown, USA'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.customerName).toBe('Jane Smith');
  });

  it('should return 404 for updating a non-existent order', async () => {
    const res = await request(app)
      .put('/orders/9999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customerName: 'Jane Smith',
        totalAmount: 40.0,
        destination: '456 Another St, Anytown, USA'
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Order not found');
  });

  it('should delete an order and return 204', async () => {
    const order = await Order.create({
      customerName: 'Jane Doe',
      totalAmount: 30.0,
      destination: '123 Main St, Anytown, USA',
      Products: [{ id: product.id, quantity: 3 }]
    }, {
    });

    const res = await request(app)
      .delete(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 if order not found when deleting', async () => {
    const res = await request(app)
      .delete('/orders/9999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Order not found');
  });
});
