const Restaurant = require('../models/restaurantModel');

const getRestaurantByName = async (req, res) => {
  try {
    const restaurantName = decodeURIComponent(req.params.name); // Fix URL encoding issues
    console.log(`Received restaurant name: ${restaurantName}`);

    const restaurant = await Restaurant.findOne({ name: restaurantName });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getRestaurantByName };
