import React from "react";
import "../../Styles/vendorpages/vendorlandingpage.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VendorLandingpage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero">
        <Header />

        <div className="hero-overlay">
          <h1>Discover the Best Deals on Products You Love</h1>
          <p>
            Shop the latest trends in fashion, electronics, home essentials, and
            more. Find everything you need with unbeatable prices and trusted
            e-commerce solutions.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorLandingpage;
