import express from 'express';
const restaurantRouter = express.Router();
import {getRestaurantByName} from '../controllers/restaurantController.js';

// Define route correctly
restaurantRouter.get('/name/:name', getRestaurantByName);

export default restaurantRouter;  // ✅ Correct export
