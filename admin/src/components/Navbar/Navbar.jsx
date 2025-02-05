import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../../../frontend/src/assets/assets';



const Navbar = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  // Static list of restaurants with IDs
  const restaurants = [
    { _id: 'abc123xyz', name: 'The Spicy Kitchen' },
    { _id: 'def456uvw', name: 'Foodie Paradise' },
    { _id: 'ghi789rst', name: 'Spice and Tandoor' },
    { _id: 'jkl012mno', name: 'Urban Chowk' },
    { _id: 'mno345pqr', name: 'Green Delight' },
    { _id: 'stu678vwx', name: 'Tasty Treats' },
    { _id: 'yza901bcd', name: 'Grill & Chill' },
    { _id: 'efg234hij', name: 'Delicious Dining' },
    { _id: 'klm567opq', name: 'Biryani Bliss' },
    { _id: 'rst890uvw', name: 'The Royal Feast' },
  ];

  // Get selected restaurant details
  const selectedRestaurantDetails = restaurants.find(r => r._id === selectedRestaurant);

  

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="Logo" />

      <div className="restaurant-selector">
        <label>Select Restaurant:</label>
        <select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)}>
          <option value="">-- Select Restaurant --</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant._id} value={restaurant._id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRestaurantDetails && (
        <div className="restaurant-id">
          <p>ID: {selectedRestaurantDetails._id}</p>
        </div>
      )}

      <img className="profile" src={assets.profile_icon} alt="Profile" />
    </div>
  );
};

export default Navbar;

