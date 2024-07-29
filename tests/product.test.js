import request from 'supertest';
import app from '../index.js';
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
});

beforeEach(async () => {
  // Reset the test database
  await Product.destroy({ where: {} });
  await Product.create({ name: 'Test Product', price: 10.0 });
});

afterEach(async () => {
  // Clean up the database
  await Product.destroy({ where: {} });
});

describe('Product API', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'New Product', price: 20.0 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('New Product');
  });

  it('should get all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a product', async () => {
    const product = await Product.create({ name: 'Update Product', price: 15.0 });
    const res = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Product', price: 15.0 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Product');
  });

  it('should delete a product', async () => {
    const product = await Product.create({ name: 'Delete Product', price: 10.0 });
    const res = await request(app)
      .delete(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 if product not found', async () => {
    const res = await request(app)
      .get('/api/products/999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(404);
  });
});
