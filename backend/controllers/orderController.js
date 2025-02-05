import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import mongoose from "mongoose";

// Config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "http://localhost:5173";

// Placing User Order using Stripe
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: "Delivery Charge" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error processing order" });
    }
};

// Placing User Order for COD
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

// Listing Orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// Fetching User Orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching user orders" });
    }
};

// Updating Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

// Verifying Order Payment Status
const verifyOrder = async (req, res) => {
    try {
        if (req.body.success === "true") {
            await orderModel.findByIdAndUpdate(req.body.orderId, { payment: true });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            await orderModel.findByIdAndDelete(req.body.orderId);
            res.json({ success: false, message: "Payment Failed, Order Cancelled" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error verifying order" });
    }
};

const updatePersonnel = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { deliveryPersonnel: req.body.deliveryPersonnel });
        res.json({ success: true, message: "Delivery Personnel Updated Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating delivery personnel" });
    }
};


const deleteOrder = async (req, res) => {
    try {
        await orderModel.findByIdAndDelete(req.params.orderId);
        res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting order" });
    }
};


  

export { updatePersonnel, placeOrder, placeOrderCod, listOrders, userOrders, updateStatus, verifyOrder, deleteOrder };
