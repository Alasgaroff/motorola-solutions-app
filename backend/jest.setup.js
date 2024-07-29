import dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });

import { jest } from '@jest/globals';

// Mock express-jwt middleware
jest.mock('express-jwt', () => {
  return () => (req, res, next) => {
    req.user = { username: 'testuser' }; 
    next();
  };
});
