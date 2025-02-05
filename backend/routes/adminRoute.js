import express from 'express';
import { fetchAllOrders } from '../../admin/src/pages/Orders/Orders';
import { List } from '../../admin/src/pages/List/List';
import { Add } from '../../admin/src/pages/Add/Add';
import authMiddleware from '../middleware/auth';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post("/register",registerAdmin);
adminRouter.post("/login",loginAdmin);
adminRouter.post("/orders",authMiddleware,fetchAllOrders);
adminRouter.post("/list",authMiddleware,List);
adminRouter.post("/add",authMiddleware,Add);

export default adminRouter;