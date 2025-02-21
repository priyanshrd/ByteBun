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

  const fetchOrders = async () => {
    const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    const orders = response.data.data;

    const newEta = {};
    const newProgress = {};
    const newReviews = {};
    const newRatings = {};

    orders.forEach((order) => {
      if (order.status === "Shipped" || order.status === "In Progress") {
        // Initialize ETA to 60 minutes
        newEta[order._id] = 60;
        newProgress[order._id] = 0;
      }
      // Initialize reviews and ratings from the backend
      newReviews[order._id] = order.review || '';
      newRatings[order._id] = order.rating || 0;
    });

    setEta(newEta);
    setProgress(newProgress);
    setData(orders);
    setReviews(newReviews);
    setRatings(newRatings);
  };

  const submitReview = async (orderId) => {
    try {
      // Submit review and rating for the order
      const response = await axios.post(
        url + "/api/order/review",
        { orderId, review: reviews[orderId] || '', rating: ratings[orderId] || 0 },
        { headers: { token } }
      );

      if (response.data.success) {
        alert("Review submitted successfully!");
        setReviews((prev) => ({ ...prev, [orderId]: '' }));
        setRatings((prev) => ({ ...prev, [orderId]: 0 }));
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

  const handleReviewChange = (orderId, value) => {
    console.log("Review changed for order:", orderId, "New value:", value); // Debugging
    setReviews((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleRatingChange = (orderId, value) => {
    console.log("Rating changed for order:", orderId, "New value:", value); // Debugging
    setRatings((prev) => ({ ...prev, [orderId]: value }));
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
            {order.status === "Delivered" && (
              <div className="review-section">
                <textarea
                  value={reviews[order._id] || ''}
                  onChange={(e) => handleReviewChange(order._id, e.target.value)}
                  placeholder={`How was` + order.items.map((item, idx) => (` ${item.name},`)) + ` and our service? \nLet us know how can we improve`}
                />
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRatingChange(order._id, star)}
                      style={{ color: ratings[order._id] >= star ? 'gold' : 'gray' }}
                    >
                      ★
                    </span>
                  ))}
                  <button className="submit-btn" onClick={() => submitReview(order._id)}>
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;