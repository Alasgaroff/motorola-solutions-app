import express from 'express';
import cors from 'cors';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import sequelize from './models/index.js';
import './models/associations.js'; 
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const allowedOrigins = [ 'http://localhost' ];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

const jwtSecret = process.env.JWT_SECRET || "default-secret";
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}
app.use(
  expressjwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({ path: ['/login', '/signup'] })
);

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const token = jwt.sign({ user: username }, jwtSecret);
  console.log(`User ${username} logged in with token ${token}`);
  res.json({ token });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

sequelize.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app, server };
