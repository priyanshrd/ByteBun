import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../../../frontend/src/assets/assets';



const Navbar = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState('');

  // Static list of restaurants with IDs
  const restaurants = [
    { _id: 'abc123xyz', name: 'Stonny Brook' },
    { _id: 'def456uvw', name: 'Ambrosia' },
    { _id: 'ghi789rst', name: 'The Nachiyar Cafe' },
    { _id: 'jkl012mno', name: 'Big Barrell Brewpub' },
    { _id: 'mno345pqr', name: 'Gingerlake View' },
    { _id: 'stu678vwx', name: 'B Town Barbeque' },
    { _id: 'yza901bcd', name: 'Omkar Grand' },
    { _id: 'efg234hij', name: 'The Hangout' },
    { _id: 'klm567opq', name: 'Full Circle' },
    { _id: 'rst890uvw', name: 'Royal Andhra Spice' },
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

