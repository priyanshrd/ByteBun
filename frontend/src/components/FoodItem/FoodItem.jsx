import React, { useState, useContext } from 'react';
import './FoodItem.css';
import assets from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image, rating }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    return stars;
  };

  // Function to toggle description visibility
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className='food-item' id='food-item'>
      <div className="food-item-img-container">
        <img className="food-item-image" src={url + "/images/" + image} alt={name} />
        {!cartItems[id]
          ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add to cart" />
          : <div className='food-item-counter'>
              <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="Remove from cart" />
              <p>{cartItems[id]}</p>
              <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="Add more" />
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className='food-item-name-rating'>
          <p>{name}</p>
          <div className="star-rating">
            {renderStars(rating)}
          </div>
        </div>
        <p
          className={`food-item-description ${showFullDescription ? 'expanded' : ''}`}
          onClick={toggleDescription}
        >
          {description}
        </p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
