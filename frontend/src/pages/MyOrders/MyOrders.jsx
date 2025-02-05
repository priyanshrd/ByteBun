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
        if (!localStorage.getItem(`eta_${order._id}`)) {
          const randomEta = Math.floor(Math.random() * 31) + 20; 
          localStorage.setItem(`eta_${order._id}`, randomEta);
          localStorage.setItem(`etaStartTime_${order._id}`, Date.now());
        }
        newEta[order._id] = parseInt(localStorage.getItem(`eta_${order._id}`));
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
      const newEta = {};
      const newProgress = {};

      data.forEach((order) => {
        if ((order.status === "Shipped" || order.status === "In Progress") && eta[order._id] > 0) {
          const startTime = parseInt(localStorage.getItem(`etaStartTime_${order._id}`));
          const initialEta = parseInt(localStorage.getItem(`eta_${order._id}`));
          const elapsedTime = Math.floor((Date.now() - startTime) / 60000); 
          const remainingTime = Math.max(initialEta - elapsedTime, 0); 

          // Calculate progress based on remaining time out of 60 minutes
          const progressPercentage = (remainingTime / 60) * 100;

          newEta[order._id] = remainingTime;
          newProgress[order._id] = progressPercentage; 
        }
      });

      setEta(newEta);
      setProgress(newProgress);
    }, 60000); 

    return () => clearInterval(interval);
  }, [data]);

  const handleReviewChange = (orderId, value) => {
    setReviews((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleRatingChange = (orderId, value) => {
    setRatings((prev) => ({ ...prev, [orderId]: value }));
  };

  const submitReview = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/review", 
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
   
  
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=Basavangudi,+Bangalore&travelmode=Two-wheeler&key=AIzaSyDhuwBWZtZmJufgzvbDubT3vGG8D7ZSA7Y`;

    // Open Google Maps in a new tab
    window.open(googleMapsUrl, '_blank');
  };
  
  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.slice().reverse().map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item, index) =>
                index === order.items.length - 1
                  ? item.name + " x " + item.quantity
                  : item.name + " x " + item.quantity + ", "
              )}</p>
              <p>{currency}{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
  
              {/* Show Delivery Personnel only when status is Shipped or In Progress */}
              {(order.status === "Shipped" || order.status === "In Progress") && order.deliveryPersonnel && (
                <p><strong>Delivery Personnel:</strong> {order.deliveryPersonnel}</p>
              )}
  
              {/* Show ETA and progress bar if order is Shipped or In Progress */}
              {(order.status === "Shipped" || order.status === "In Progress") && eta[order._id] > 0 && (
                <div>
                  <p><strong>ETA:</strong> {eta[order._id]} min</p>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress[order._id]}%` }}></div>
                  </div>
                </div>
              )}
  
              {/* Show review input only if order is delivered */}
              {order.status === "Delivered" && (
                <div className="review-section">
                  <h4>Leave a Review:</h4>
                  <textarea 
                    value={reviews[order._id] || ''} 
                    onChange={(e) => handleReviewChange(order._id, e.target.value)}
                    placeholder="Write your review here..."
                  />
  
                  {/* Star Rating */}
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
  
              {/* Track Order Button */}
              <button onClick={() => openGoogleMaps(order)}>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
  
};

export default MyOrders;
