import request from 'supertest';
import { app, server } from '../index.js';
import Product from '../models/product.js';
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

describe('Product API', () => {
  beforeEach(async () => {
    await Product.create({ name: 'Test Product', price: 10.0 });
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'New Product', price: 20.0 });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('New Product');
  });

  it('should get all products', async () => {
    const res = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a product', async () => {
    const product = await Product.findOne();
    const res = await request(app)
      .put(`/products/${product.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ price: 15.0 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.price).toBe(15.0);
  });

  it('should delete a product', async () => {
    const product = await Product.findOne();
    const res = await request(app)
      .delete(`/products/${product.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);
  });
});
