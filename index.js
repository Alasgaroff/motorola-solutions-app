import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';

const app = express();
app.use(bodyParser.json());

const auth = jwt({
  secret: 'my-secret-key',
  algorithms: ['HS256'],
});

app.use('/api', auth, productRoutes);
app.use('/api', auth, orderRoutes);

app.post('/login', (req, res) => {
  const token = jsonwebtoken.sign({ user: req.body.username }, 'my-secret-key');
  res.json({ token });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
