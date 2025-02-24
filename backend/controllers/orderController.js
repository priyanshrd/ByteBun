import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import 'dotenv/config';
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import mongoose from "mongoose";

// Config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "http://192.168.247.109:5174";

// Function to update user preferences
const updateUserPreferences = async (userId, order) => {
  try {
    // Find the user
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Analyze order items to update preferences
    order.items.forEach((item) => {
      if (!user.preferences.includes(item.category)) {
        user.preferences.push(item.category); // Add new category to preferences
      }
    });

    // Update favorite restaurants
    if (!user.favoriteRestaurants.includes(order.restaurant_id)) {
      user.favoriteRestaurants.push(order.restaurant_id); // Add new restaurant to favorites
    }

    // Add the order to orderHistory
    user.orderHistory.push(order);

    // Save the updated user
    await user.save();

    console.log("User preferences updated successfully:", user.preferences);
  } catch (error) {
    console.error("Error updating user preferences:", error);
  }
};

// Adding Review for Order
const reviewOrder = async (req, res) => {
  try {
    const { orderId, review, rating } = req.body;

    // Validate the input
    if (!orderId || !rating) {
      return res.status(400).json({ success: false, message: "Order ID and Rating are required" });
    }

    // Ensure the rating is within the valid range (1 to 5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Find the order and update the review and rating
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { review, rating },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Review submitted successfully", data: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error submitting review" });
  }
};

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

    // Update user preferences after placing the order
    await updateUserPreferences(req.body.userId, newOrder);

    // Clear the user's cart
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

    // Update user preferences after placing the order
    await updateUserPreferences(req.body.userId, newOrder);

    // Clear the user's cart
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

// Updating Delivery Personnel
const updatePersonnel = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { deliveryPersonnel: req.body.deliveryPersonnel });
    res.json({ success: true, message: "Delivery Personnel Updated Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating delivery personnel" });
  }
};

// Deleting an Order
const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.orderId);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

export {
  reviewOrder,
  placeOrder,
  placeOrderCod,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  updatePersonnel,
  deleteOrder,
};