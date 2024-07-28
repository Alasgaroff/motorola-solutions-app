import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export async function getShippingCost(productId, quantity) {
  const cacheKey = `${productId}_${quantity}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  try {
    const response = await axios.get('https://external-shipping-api.com/cost', {
      params: { productId, quantity },
    });
    const cost = response.data.cost;
    cache.set(cacheKey, cost);
    return cost;
  } catch (error) {
    throw new Error('Error fetching shipping cost');
  }
}
