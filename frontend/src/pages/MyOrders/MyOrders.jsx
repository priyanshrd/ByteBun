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
    orders.forEach((order) => {
      if (order.status === "Shipped" || order.status === "In Progress") {
        // Initialize ETA to 60 minutes
        newEta[order._id] = 60;
        newProgress[order._id] = 0;
      }
    });

    setEta(newEta);
    setProgress(newProgress);
    setData(orders);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEta = { ...eta };
      const newProgress = { ...progress };

      data.forEach((order) => {
        if ((order.status === "Shipped" || order.status === "In Progress") && newEta[order._id] > 0) {
          // Decrease ETA by 1 minute every 15 seconds
          const currentSeconds = new Date().getSeconds();
          if (currentSeconds % 15 === 0) {
            newEta[order._id] = Math.max(newEta[order._id] - 1, 0);
            newProgress[order._id] = ((60 - newEta[order._id]) / 60) * 100;
          }
        }
      });

      setEta(newEta);
      setProgress(newProgress);
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [data, eta, progress]);

  const handleReviewChange = (orderId, value) => {
    setReviews((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleRatingChange = (orderId, value) => {
    setRatings((prev) => ({ ...prev, [orderId]: value }));
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
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      alert("Error submitting review.");
    }
  };

  const openGoogleMaps = (order) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=Basavangudi,+Bangalore&destination=Current+Location&travelmode=Two-wheeler&key=AIzaSyDhuwBWZtZmJufgzvbDubT3vGG8D7ZSA7Y`;
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
            
            {(order.status === "Processing" )? (
              <button className="track-order-pending-btn">Order Pending</button>
            ):

             (
            ((order.status === "Shipped") &&  !(order.status === "Processing") && eta[order._id] > 0 )? (
            <button className="track-order-btn" onClick={() => openGoogleMaps(order)}>Track Order</button>
            ):
            <button className="track-order-delivery-btn">Delivered!</button>
            )
            }

           


            {/* Review Section */}
            {order.status === "Delivered" && (
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
                <button onClick={() => submitReview(order._id)}>Submit Review</button>
              </div>
            )}

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;