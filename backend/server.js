import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

// App config
const app = express();
const port = process.env.PORT || 4000; // Use environment variable for port

// Middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads")); // Serve static files
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Predefined Q&A for the chatbot
const qaPairs = {
  "how do i cancel my order": "You can cancel your order by visiting the 'My Orders' page and selecting 'Cancel Order.' Please note that orders can only be canceled before they are shipped.",
  "list my order details": "You can view all your order details by visiting the 'My Orders' section under your profile. This includes order status, items, and delivery information.",
  "why can't i get my delivery status": "Delivery status updates may take up to 24 hours to reflect the latest information. If your order status hasn't been updated, please contact support for assistance.",
  "how do i contact customer support": "You can reach our customer support team at support@bytebun.com or call us at +91-76764-33089. Our team is available from 9 AM to 9 PM, Monday to Saturday.",
  "what are your delivery hours": "We deliver from 9 AM to 9 PM, Monday to Saturday. Deliveries are not available on Sundays and public holidays.",
  "how do i update my payment method": "You can update your payment method in the 'Payment Settings' section of your account. Please ensure your new payment method is valid and up-to-date.",
  "where is my order": "You can track your order in the 'My Orders' section of your account. If you need further assistance, please contact support.",
  "how do i apply a discount code": "You can apply a discount code during checkout. Enter your code in the 'Apply Discount' section before completing your purchase.",
  "what is your return policy": "You can return items within 30 days of delivery, provided they are unused and in their original packaging. Visit the 'Returns' page for detailed instructions.",
  "how do i change my delivery address": "You can update your delivery address in the 'Account Settings' page. Please ensure the new address is correct before placing your order.",
  "what payment methods do you accept": "We accept credit/debit cards, UPI, net banking, and popular digital wallets like Paytm and Google Pay.",
  "can i modify my order after placing it": "Unfortunately, orders cannot be modified after they are placed. If you need to make changes, please cancel the order and place a new one.",
  "do you offer international shipping": "Currently, we only offer shipping within India. International shipping is not available at this time.",
  "how do i track my order": "You can track your order in the 'My Orders' section of your account. You will receive updates via email and SMS as well.",
  "what should i do if my order is delayed": "If your order is delayed, please check the delivery status in the 'My Orders' section. If the delay persists, contact support for assistance.",
  "is there a minimum order amount for delivery": "Yes, there is a minimum order amount of ₹100 for delivery. This ensures we can provide efficient and affordable delivery services.",
  "how do i check my refund status": "You can check your refund status in the 'My Orders' section. Refunds are typically processed within 5-7 business days.",
  "can i cancel a delivered order": "No, delivered orders cannot be canceled. However, you can initiate a return if the item is eligible under our return policy.",
  "what if i receive a damaged product": "If you receive a damaged product, please contact support immediately with photos of the damaged item. We will assist you with a replacement or refund.",
  "how do i unsubscribe from promotional emails": "You can unsubscribe from promotional emails by clicking the 'Unsubscribe' link at the bottom of any promotional email.",
};

// Chatbot route
app.post("/api/chatbot", (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "User message is required" });
    }

    // Convert user message to lowercase for matching
    const userMessageLower = userMessage.trim().toLowerCase();

    // Find the answer or provide a default response
    const botReply = qaPairs[userMessageLower] || "Sorry, I don't understand that question. Please contact support at support@bytebun.com or call +91-76764-33089 for further assistance.";

    res.json({ botReply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to fetch response" });
  }
});


// Root endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, '192.168.247.109', () => {
  console.log(`Server is running on http://192.168.247.109:${port}`);
  console.log(`Server is running on http://localhost:${port}`);
});