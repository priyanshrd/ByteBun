import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { deleteOrder, listOrders, placeOrder,updateStatus,userOrders, verifyOrder, placeOrderCod, updatePersonnel } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.delete("/delete/:orderId",deleteOrder);
orderRouter.get("/list",listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",updateStatus);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/placecod",authMiddleware,placeOrderCod);
orderRouter.post("/updatepersonnel", updatePersonnel);


export default orderRouter;