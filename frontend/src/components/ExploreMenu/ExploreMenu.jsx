import React, { useEffect, useRef, useState } from 'react';
import './ExploreMenu.css';
import { menu_list, restaurants } from '../../assets/assets';
import FoodDisplay from '../FoodDisplay/FoodDisplay';

const ExploreMenu = ({ category, setCategory, onExploreRestaurants = () => {} }) => {
  const exploreMenuListRef = useRef(null); // Ref for the list container
  const [isScrolling, setIsScrolling] = useState(false); // Track if the user is manually scrolling
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // State for selected restaurant
  const [activeTab, setActiveTab] = useState('categories'); // State to manage active tab

  // Reset selectedRestaurant when switching tabs
  useEffect(() => {
    setSelectedRestaurant(null);
  }, [activeTab]);

  // Auto-scroll functionality
  useEffect(() => {
    const exploreMenuList = exploreMenuListRef.current;

    // Only start auto-scroll if the exploreMenuList element exists
    if (!exploreMenuList) return;

    let scrollAmount = 0;
    const scrollSpeed = 1; // Adjust speed (pixels per frame)
    let animationFrameId;

    const autoScroll = () => {
      if (!isScrolling) { // Only auto-scroll if the user is not manually scrolling
        if (scrollAmount >= exploreMenuList.scrollWidth / 2) {
          scrollAmount = 0; // Reset scroll position
        } else {
          scrollAmount += scrollSpeed; // Increment scroll position
        }
        exploreMenuList.style.transform = `translateX(-${scrollAmount}px)`;
      }
      animationFrameId = requestAnimationFrame(autoScroll); // Continue animation
    };

    // Start auto-scrolling
    autoScroll();

    // Cleanup animation frame
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScrolling, activeTab]); // Add activeTab to dependencies

  // Handle manual scroll
  const handleScroll = (e) => {
    setIsScrolling(true); // User is manually scrolling
    clearTimeout(window.scrollTimeout); // Clear any existing timeout
    window.scrollTimeout = setTimeout(() => {
      setIsScrolling(false); // Resume auto-scroll after a delay
    }, 2000); // Adjust delay as needed (2 seconds in this case)
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <div className="explore-buttons">
        <button
          className={`explore-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Explore Categories
        </button>
        <button
          className={`explore-button ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('restaurants');
            if (typeof onExploreRestaurants === 'function') {
              onExploreRestaurants(); // Only call if it's a function
            }
          }}
        >
          Explore Restaurants
        </button>
      </div>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring an array of dishes
      </p>
      {activeTab === 'categories' && (
        <div className="explore-menu-list-container">
          <div
            className='explore-menu-list'
            ref={exploreMenuListRef}
            onScroll={handleScroll} // Listen for manual scroll
            onTouchMove={handleScroll} // Listen for touch scroll on mobile
            onMouseDown={() => setIsScrolling(true)} // Listen for mouse drag
            onMouseUp={() => setIsScrolling(false)} // Listen for mouse release
          >
            {menu_list.map((item, index) => {
              return (
                <div
                  onClick={() => setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))}
                  key={index}
                  className='explore-menu-list-item'
                >
                  <img
                    className={category === item.menu_name ? "active" : ""}
                    src={item.menu_image}
                    alt={item.menu_name}
                  />
                  <p>{item.menu_name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 'restaurants' && (
        <div className="explore-restaurant-list-container">
          <div
            className='explore-restaurant-list'
            onScroll={handleScroll} // Listen for manual scroll
            onTouchMove={handleScroll} // Listen for touch scroll on mobile
            onMouseDown={() => setIsScrolling(true)} // Listen for mouse drag
            onMouseUp={() => setIsScrolling(false)} // Listen for mouse release
          >
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className={`explore-restaurant-item ${selectedRestaurant === restaurant._id ? 'active' : ''}`}
                onClick={() => setSelectedRestaurant(restaurant._id)}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                />
                <p>{restaurant.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <hr />
      {/* Render FoodDisplay only once */}
      <FoodDisplay
        category={activeTab === 'categories' ? category : null}
        selectedRestaurant={activeTab === 'restaurants' ? selectedRestaurant : null}
      />
    </div>
  );
};

export default ExploreMenu;