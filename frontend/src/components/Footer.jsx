import React from "react";
import "../Styles/components/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-about">
          <h1>E-Commerce Store</h1>
          <p>
            ShopEase.pk - Pakistan's best free online shopping platform. Your
            trusted destination for buying, selling, and discovering the latest
            deals online.
          </p>

          <p>Follow us on:</p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/darazpk/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.pinterest.com/darazpk/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-pinterest-p"></i>
            </a>
            <a
              href="https://www.instagram.com/darazpk/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Quick Links Searches</h4>
          <ul>
            <li>Shop by Category</li>
            <li>Today's Deals</li>
            <li>Best Sellers</li>
            <li>Customer Support</li>
          </ul>
        </div>
        <div className="footer-company">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Place Free Ad</li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>1st Floor, ShopEase Plaza, Main Boulevard</p>
          <p>Valencia Town, Lahore</p>
          <p>Email: support@shopease.pk</p>
          <p>Phone: +92 320 145 00 92</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© ShopEase.pk 2024. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
