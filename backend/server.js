import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini SDK
import "dotenv/config";
import orderModel from "./models/orderModel.js";
import jwt from "jsonwebtoken"; // Import JWT for authentication middleware

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Load API key from .env
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Use "gemini-pro" model

// Authentication Middleware
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user information to the request object
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads")); // Serve static files
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get('/api/directions', async (req, res) => {
  const { origin, destination } = req.query;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=AIzaSyDhuwBWZtZmJufgzvbDubT3vGG8D7ZSA7Y`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Failed to fetch directions" });
  }
});

// Chatbot route (protected by authentication)
app.post("/api/chatbot", authenticateUser, async (req, res) => {
  try {
    const { userMessage } = req.body;
    const userId = req.user.id; // Get the user ID from the authenticated user

    if (!userMessage) {
      return res.status(400).json({ success: false, message: "User message is required" });
    }

    // Step 1: Retrieve all orders from the database
    const orders = await orderModel.find({});

    // Log all orders for debugging
    console.log("All Orders:", orders);

    // Step 2: Create a prompt for Gemini
    const prompt = `You are a helpful assistant for a food delivery website called ByteBun. Answer the user's question based on the following data:\n\n${JSON.stringify(
      orders + ' { _id: abc123xyz, name: Stonny Brook }, _id: def456uvw, name: Ambrosia },    { _id: ghi789rst, name: The Nachiyar Cafe },    { _id: jkl012mno, name: Big Barrell Brewpub },    { _id: mno345pqr, name: Gingerlake View },   { _id: stu678vwx, name: B Town Barbeque },   { _id: yza901bcd, name: Omkar Grand },    { _id: efg234hij, name: The Hangout },    { _id: klm567opq, name: Full Circle },    { _id: rst890uvw, name: Royal Andhra Spice }'   )}\n\nUser query: ${userMessage}`;

    // Step 3: Generate a response using Gemini
    const result = await model.generateContent(prompt);
    const botReply = result.response.text(); // Extract the generated response

    // Step 4: Send the response back to the frontend
    res.json({ success: true, botReply });
  } catch (error) {
    console.error("Chatbot error:", error);

    // Log the error for debugging
    console.error("Error details:", error.message);

    // Return a meaningful error response to the frontend
    res.status(500).json({ success: false, message: "Failed to process your request. Please try again." });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port () => {
  console.log(`Server is running on http://localhost:${port}`);
});
