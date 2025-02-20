import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <div className = 'header-contents'>
            <h2>Fulfill your cravings</h2>
            <p>Without feeding your patience</p>
            <a href="#food-display" className="href"><button>Order now!</button></a>
            
        </div>
    </div>
  )
}

export default Header