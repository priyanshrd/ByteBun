import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  preferences: { type: Array, default: [] }, // Preferred categories (e.g., ["Pizza", "Burger"])
  favoriteRestaurants: { type: Array, default: [] }, // Favorite restaurant IDs
  orderHistory: { type: Array, default: [] }, // List of past orders
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;