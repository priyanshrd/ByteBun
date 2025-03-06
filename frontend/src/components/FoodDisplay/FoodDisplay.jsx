import React, { useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../context/StoreContext';

const FoodDisplay = ({ category, selectedRestaurant }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <div className='food-display-list'>
        {food_list.map((item) => {
          // Filter based on category or selected restaurant
          if (
            (category && ( category === item.category)) ){
              return (
                <FoodItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  rating={item.rating} // Pass the rating prop here
                />
              );
            }else if (selectedRestaurant && selectedRestaurant === item.restaurant_id){
              return (
                <FoodItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  rating={item.rating} // Pass the rating prop here
                />
              );
            }
           else 
          return null; // Return null for items that don't match the category or restaurant
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
