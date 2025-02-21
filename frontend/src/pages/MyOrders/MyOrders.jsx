import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, currency } = useContext(StoreContext);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [eta, setEta] = useState({});
  const [progress, setProgress] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});


  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    const orders = response.data.data;

    const newEta = {};
    const newProgress = {};
    const newReviews = {};
    const newRatings = {};

    orders.forEach((order) => {
      if (order.status === "Shipped" || order.status === "In Progress") {
        // Calculate remaining time based on current minutes
        const currentMinutes = new Date().getMinutes();
        const remainingTime = 60 - currentMinutes; // Remaining time until the next hour
        newEta[order._id] = remainingTime;
        newProgress[order._id] = ((60 - remainingTime) / 60) * 100; // Progress percentage
      }
    });

    setEta(newEta);
    setProgress(newProgress);
    setData(orders);
    setReviews(newReviews);
    setRatings(newRatings);
  };

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
  
        // Mark this order as reviewed
        setSubmittedReviews((prev) => ({ ...prev, [orderId]: true }));
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      alert("Error submitting review.");
    }
  };
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

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
    }, 6000); // Update every minute

    return () => clearInterval(interval);
  }, [data]);

  const handleReviewChange = (orderId, value) => {
    setReviews((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleRatingChange = (orderId, value) => {
    setRatings((prev) => ({ ...prev, [orderId]: value }));
  };

  

  

  const openGoogleMaps = (order) => {

    
    const places = [
      "Stonny Brook, Bangalore",
      "Ambrosia, RR Nagar Bangalore",
      "The Nachiyar Cafe, RR Nagar, Bangalore",
      "Big Barrell Brewpub, Bangalore",
      "Gingerlake View, Bangalore",
      "B Town Barbeque, Bangalore",
      "Omkar Grand, Bangalore",
      "The Hangout, Bangalore",
      "Full Circle - taproom, Bangalore",
      "Royal Andhra Spice, Bangalore"
    ];
    
    // Pick a random place from the array
    const randomPlace = places[Math.floor(Math.random() * places.length)];
    
    // Google Maps URL with random place as origin
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(randomPlace)}&destination=Current+Location&travelmode=Two-wheeler&key=AIzaSyDhuwBWZtZmJufgzvbDubT3vGG8D7ZSA7Y`;
    
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
            {(order.status === "Shipped" || order.status === "In Progress") ?
              <button className="track-order-btn" onClick={() => openGoogleMaps(order)}>Track Order</button>
              :
              <button className="track-order-delivery-btn" >ThankYou</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;