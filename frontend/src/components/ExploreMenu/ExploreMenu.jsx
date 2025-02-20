import React, { useEffect, useRef, useState } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  const exploreMenuListRef = useRef(null); // Ref for the list container
  const [isScrolling, setIsScrolling] = useState(false); // Track if the user is manually scrolling

  // Auto-scroll functionality
  useEffect(() => {
    const exploreMenuList = exploreMenuListRef.current;

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
  }, [isScrolling]);

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
      <h1>↓ Explore our menu ↓</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring an array of dishes
      </p>
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
      <hr />
    </div>
  );
};

export default ExploreMenu;