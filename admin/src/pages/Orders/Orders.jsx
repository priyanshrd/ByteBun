import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the server
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  // Update order status
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        fetchAllOrders();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Update delivery personnel
  const dummyPersonnel = [
    "Rajesh Kumar", 
    "Amit Sharma", 
    "Vikram Singh", 
    "Pooja Patel", 
    "Suresh Reddy"
  ];
  
  const updateDeliveryPersonnel = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/updatepersonnel`, {
        orderId,
        deliveryPersonnel: event.target.value
      });
  
      if (response.data.success) {
        toast.success("Delivery personnel updated");
        fetchAllOrders(); // Refresh the list
      } else {
        toast.error("Error updating delivery personnel");
      }
    } catch (error) {
      toast.error("Failed to update delivery personnel");
    }
  };
  

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
        const response = await axios.delete(`${url}/api/order/delete/${orderId}`);

        if (response.data.success) {
            toast.success("Order deleted successfully");
            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId)); // Remove from UI
        } else {
            toast.error("Error deleting order");
        }
    } catch (error) {
        console.error("Delete request failed:", error.response?.data || error);
        toast.error("Failed to delete order");
    }
};


  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <div className="order-details">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, index) =>
                    index === order.items.length - 1
                      ? item.name + " x " + item.quantity
                      : item.name + " x " + item.quantity + ", "
                  )}
                </p>
                <p className='order-item-name'>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className='order-item-address'>
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
                
                {/* Delivery Personnel Input Field */}
                <label><strong>Delivery Personnel:</strong></label>
                <select onChange={(e) => updateDeliveryPersonnel(e, order._id)} value={order.deliveryPersonnel || ""}>
                  <option value="">Select Personnel</option>
                  {dummyPersonnel.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                  ))}
                </select>

              </div>
              <p>Items: {order.items.length}</p>
              <p>{currency}{order.amount}</p>
            </div>
            
            {/* Order Actions */}
            <div className="order-actions">
              {/* Order Status Dropdown */}
              <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select onChange={(e) => e.target.value === "Confirm Delete" && deleteOrder(order._id)} defaultValue="Select">
                <option value="Select" disabled>Select Action</option>
                <option value="Delete">Confirm Delete</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
