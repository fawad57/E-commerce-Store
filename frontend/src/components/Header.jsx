import React, { useEffect, useState } from "react";
import "../Styles/components/header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import DefaultProfileIcon from "../assets/profile-icon.png"; // Default profile icon image

const Header = () => {
  const [vendorId, setVendorId] = useState("");
  const [profilePicture, setProfilePicture] = useState(DefaultProfileIcon);
  const [menuOpen, setMenuOpen] = useState(false); // State for side menu toggle
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      navigate("/login");
    } else {
      axios
        .post(
          "http://localhost:5000/api/protected/verify-token",
          {},
          { headers: { Authorization: `Bearer ${token}` } } // Pass token in Authorization header
        )
        .then((response) => {
          setVendorId(response.data.user._id);
          setProfilePicture(response.data.user.picture);
        })
        .catch(() => {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleClick = () => {
    navigate("/vendorprofile");
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <h2>E-Commerce Store</h2>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <a href="./vendorlandingpage">Home</a>
          <a href={`./vendorproducts?vendorId=${vendorId}`}>Products</a>
          <a href={`./vendordashboard?vendorId=${vendorId}`}>Dashboard</a>
          <a href={`./messaging?vendorId=${vendorId}`}>Notifications</a>
          <a href={`./vendormaintenance?vendorId=${vendorId}`}>Maintenance</a>

          <div className="profile-container">
            <img
              src={
                profilePicture
                  ? `http://localhost:5000/${profilePicture}`
                  : DefaultProfileIcon
              }
              alt="Profile"
              className="profile-icon"
              onClick={handleClick}
            />
          </div>
        </nav>

        {/* Hamburger Icon */}
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="overlay show"
            onClick={closeMenu} // Close menu when clicking outside
          ></div>
        )}

        {/* Side Menu */}
        <div className={`side-menu ${menuOpen ? "open" : ""}`}>
          <a
            href={`./vendorlandingpage?vendorId=${vendorId}`}
            onClick={closeMenu}
          >
            Home
          </a>
          <a href={`./vendorproducts?vendorId=${vendorId}`} onClick={closeMenu}>
            Products
          </a>
          <a
            href={`./vendordashboard?vendorId=${vendorId}`}
            onClick={closeMenu}
          >
            Dashboard
          </a>
          <a href={`./messaging?vendorId=${vendorId}`} onClick={closeMenu}>
            Notifications
          </a>
          <a
            href={`./vendormaintenance?vendorId=${vendorId}`}
            onClick={closeMenu}
          >
            Maintenance
          </a>
          <a href="/vendorprofile" onClick={closeMenu}>
            Profile
          </a>
        </div>
      </header>
    </>
  );
};

export default Header;
