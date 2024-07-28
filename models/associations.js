import sequelize from './index.js'; // Import sequelize instance
import Product from './product.js';
import Order from './order.js';
import OrderProduct from './orderProduct.js';

// Relationships
Product.belongsToMany(Order, { through: OrderProduct });
Order.belongsToMany(Product, { through: OrderProduct });

// Sync models
(async () => {
  try {
    await sequelize.sync({ force: false }); // Set to true only for initial setup
    console.log('Database & tables created!');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
})();
