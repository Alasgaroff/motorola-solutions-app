import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Order = sequelize.define('Order', {
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Order;
