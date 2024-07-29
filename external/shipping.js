import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export async function getShippingCost(weight, destination) {
  const cacheKey = `${weight}_${destination}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  try {
    // const response = await axios.get(`https://api.shipping.com/cost?weight=${weight}&destination=${destination}`);
    // const cost = response.data.cost;
    const cost = 999.99;
    
    cache.set(cacheKey, cost);
    return cost;
  } catch (error) {
    throw new Error('Error fetching shipping cost');
  }
}
