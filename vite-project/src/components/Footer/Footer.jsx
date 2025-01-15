import React from 'react'
import './Footer.css'
import {assets} from "../../assets/assets"
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className = 'footer-content-left'>
                <img className='footer-logo' src={assets.logo} alt =""/>
                <p>Lorem ipsum 
                    is simply dummy text of the printing and typesetting
                </p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className = 'footer-content-right'>
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 76764 33089</li>
                    <li>priyansh17rd@gmail.com</li>
                </ul>
            </div>
            
        </div>
        <hr />
        <p className = "footer-copyright"> Copyright 2025 © ByteBun.com - All Right Reserved. </p>
    </div>
  )
}

export default Footer
