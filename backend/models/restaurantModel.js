import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    numReviews: { type: Number, required: true },
    restaurant_id: { type: String, required: true },
    password: { type: String, required: true }

})