import express from 'express';
import bodyParser from 'body-parser';
import { expressjwt } from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import sequelize from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const auth = expressjwt({
  secret: process.env.SECRET_KEY,
  algorithms: ['HS256'],
});

app.use('/api', auth, productRoutes);
app.use('/api', auth, orderRoutes);

app.post('/login', (req, res) => {
  const token = jsonwebtoken.sign({ user: req.body.username }, process.env.SECRET_KEY);
  res.json({ token });
});

sequelize.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
