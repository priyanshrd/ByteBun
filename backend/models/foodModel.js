import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    image: { type: String, required: true },
    category:{ type:String, required:true},
    restaurant_id: { type: String, required: true }, // Store restaurant
    review: { type: String, default: '' }, // Store review text
    rating: { type: Number, default: 0 },  // Store rating (0-5)
})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;