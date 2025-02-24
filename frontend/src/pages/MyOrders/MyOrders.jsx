import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, currency } = useContext(StoreContext);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [eta, setEta] = useState({});
  const [progress, setProgress] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  // Fetch orders from the server
  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      const orders = response.data.data;

      const newEta = {};
      const newProgress = {};

      orders.forEach((order) => {
        if (order.status === "Shipped" || order.status === "In Progress") {
          const currentMinutes = new Date().getMinutes();
          const remainingTime = 60 - currentMinutes; // Remaining time until the next hour
          newEta[order._id] = remainingTime;
          newProgress[order._id] = ((60 - remainingTime) / 60) * 100; // Progress percentage
        }
      });

      setEta(newEta);
      setProgress(newProgress);
      setData(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Submit a review for an order
  const submitReview = async (orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/review",
        { orderId, review: reviews[orderId] || '', rating: ratings[orderId] || 0 },
        { headers: { token } }
      );

      if (response.data.success) {
        alert("Review submitted successfully!");
        setReviews((prev) => ({ ...prev, [orderId]: '' }));
        setRatings((prev) => ({ ...prev, [orderId]: 0 }));
        setSubmittedReviews((prev) => ({ ...prev, [orderId]: true }));
        fetchOrders(); // Refresh orders after submitting a review
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      alert("Error submitting review.");
    }
  };

  // Fetch orders periodically
  useEffect(() => {
    if (token) {
      fetchOrders(); // Initial fetch
      const interval = setInterval(fetchOrders, 5000); // Fetch every 5 seconds
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [token]);

  // Update ETA and progress every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newEta = {};
      const newProgress = {};

      data.forEach((order) => {
        if ((order.status === "Shipped" || order.status === "In Progress") && eta[order._id] > 0) {
          const currentMinutes = new Date().getMinutes();
          const remainingTime = 60 - currentMinutes; // Remaining time until the next hour
          const progressPercentage = ((60 - remainingTime) / 60) * 100; // Progress percentage

          newEta[order._id] = remainingTime;
          newProgress[order._id] = progressPercentage;
        }
      });

      setEta(newEta);
      setProgress(newProgress);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data]);

  // Handle review input change
  const handleReviewChange = (orderId, value) => {
    setReviews((prev) => ({ ...prev, [orderId]: value }));
  };

  // Handle rating input change
  const handleRatingChange = (orderId, value) => {
    setRatings((prev) => ({ ...prev, [orderId]: value }));
  };

  // Open Google Maps for order tracking
  const openGoogleMaps = (order) => {
    console.log(order);
  
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

    const origin = restaurants.find((restaurant) => restaurant._id === order.items[0].restaurant_id).name;
    const destination = `${order.address.street} ${order.address.city}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=Two-wheeler&key=AIzaSyDhuwBWZtZmJufgzvbDubT3vGG8D7ZSA7Y`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="orders-container">
        {data.slice().reverse().map((order, index) => (
          <div key={index} className="order-card">
            <div className="order-header">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div className="order-details">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Items:</strong> {order.items.map((item, idx) => (
                  <span key={idx}>{item.name} x {item.quantity}{idx !== order.items.length - 1 ? ', ' : ''}</span>
                ))}</p>
                <p><strong>Total:</strong> {currency}{order.amount}.00</p>
                <p><strong>Status:</strong> <span className={`status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></p>
              </div>
            </div>

            {/* Delivery Personnel */}
            {(order.status === "Shipped" || order.status === "In Progress") && order.deliveryPersonnel && (
              <div className="delivery-personnel">
                <p><strong>Delivery Personnel:</strong> {order.deliveryPersonnel}</p>
              </div>
            )}

            {/* ETA and Progress Bar */}
            {(order.status === "Shipped" || order.status === "In Progress") && eta[order._id] > 0 && (
              <div className="eta-progress">
                <p><strong>ETA:</strong> {eta[order._id]} min</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progress[order._id]}%` }}></div>
                </div>
              </div>
            )}

            {/* Review Section */}
            {order.status === "Delivered" && !submittedReviews[order._id] && (
              <div className="review-section">
                <h4>Leave a Review:</h4>
                <textarea
                  value={reviews[order._id] || ''}
                  onChange={(e) => handleReviewChange(order._id, e.target.value)}
                  placeholder="Write your review here..."
                />
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRatingChange(order._id, star)}
                      style={{ cursor: 'pointer', color: ratings[order._id] >= star ? 'gold' : 'gray' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <button className='submit-btn' onClick={() => submitReview(order._id)}>Submit Review</button>
              </div>
            )}

            {/* Track Order Button */}
            {(order.status === "Shipped" || order.status === "In Progress" || order.status === "Food Processing") && (
              <button className="track-order-btn" onClick={() => openGoogleMaps(order)}>Track Order</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
