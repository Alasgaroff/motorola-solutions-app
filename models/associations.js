import sequelize from './index.js';
import Product from './product.js';
import Order from './order.js';
import OrderProduct from './orderProduct.js';

Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId' });
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId' });
