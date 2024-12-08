import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2"; // Importing the Line chart
import "chart.js/auto";
import "../../Styles/vendorpages/VendorDashboard.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VendorDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");

  const [products, setProducts] = useState([]);
  const [topReviewsProducts, setTopReviewsProducts] = useState([]);
  const [topProductsData, setTopProductsData] = useState({
    labels: [],
    datasets: [],
  });
  const [topRatingsData, setTopRatingsData] = useState({
    labels: [],
    datasets: [],
  });
  const [averageRatingsData, setAverageRatingsData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/vendor/products/get_products/${vendorId}`)
      .then((response) => {
        const productsData = response.data.products || [];
        setProducts(productsData);
        calculatePerformanceMetrics(productsData);
        getTopReviewsProducts(productsData);
        calculateAverageRatingsOverTime(productsData); // Calculate average ratings over time
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const calculatePerformanceMetrics = (products) => {
    if (!products || products.length === 0) return;

    // Top Products by Sales (Bar Chart)
    const topProducts = [...products]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    setTopProductsData({
      labels: topProducts.map((product) => product.name),
      datasets: [
        {
          label: "Top Products (Sales)",
          data: topProducts.map((product) => product.sales),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });

    // Top Products by Ratings (Pie Chart)
    const topRatedProducts = [...products]
      .filter((product) => product.avgratings)
      .sort((a, b) => b.avgratings - a.avgratings)
      .slice(0, 5);

    setTopRatingsData({
      labels: topRatedProducts.map((product) => product.name),
      datasets: [
        {
          label: "Top Products by Ratings",
          data: topRatedProducts.map((product) => product.avgratings),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    });
  };

  const getTopReviewsProducts = (products) => {
    if (!products || products.length === 0) return;

    // Get Top 4 most reviewed products
    const sortedByReviews = [...products]
      .sort((a, b) => b.reviews.length - a.reviews.length)
      .slice(0, 4);
    setTopReviewsProducts(sortedByReviews);
  };

  const calculateAverageRatingsOverTime = (products) => {
    // Top 5 products by average rating
    const topRatedProducts = [...products]
      .sort((a, b) => b.avgratings - a.avgratings)
      .slice(0, 5);

    // Pie chart color scheme to use in the line chart as well
    const pieChartColors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
    ];

    // Prepare the dataset for the line chart using the same color scheme
    const data = topRatedProducts.map((product, index) => {
      const labels = product.reviews.map((review) =>
        new Date(review.createdAt).toLocaleDateString()
      );
      const ratings = product.reviews.map((review) => review.rating);

      return {
        label: product.name,
        data: ratings,
        fill: false,
        borderColor: pieChartColors[index], // Using pie chart colors
        tension: 0.1, // For smoother lines
      };
    });

    setAverageRatingsData({
      labels:
        topRatedProducts[0]?.reviews.map((review) =>
          new Date(review.createdAt).toLocaleDateString()
        ) || [],
      datasets: data,
    });
  };

  return (
    <>
      <Header />
      <div className="multiproducts-dashboard">
        <div className="dashboard-summary">
          <h2>Top 4 Most Reviewed Products</h2>
          <div className="product-grid">
            {topReviewsProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-card-image-container">
                  <img
                    src={`http://localhost:5000/${product.images[0]}`}
                    alt={product.name}
                    className="product-card-image"
                  />
                </div>
                <div className="product-card-info">
                  <h3>{product.name}</h3>
                  <p>💲 Price: ${product.price}</p>
                  <p>📦 Stock: {product.stock}</p>
                  <p>⭐ Reviews: {product.reviews.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="performance-reports">
          <h2>Performance Reports</h2>
          <div className="chart-container">
            <h3>Top Products (Sales)</h3>
            {topProductsData.datasets.length > 0 ? (
              <Bar data={topProductsData} />
            ) : (
              <p>No data available for top products.</p>
            )}
          </div>

          {/* Line Chart for Average Ratings Over Time */}
          <div className="chart-container">
            <h3>Average Ratings Over Time (Top 5 Products)</h3>
            {averageRatingsData.datasets.length > 0 ? (
              <Line data={averageRatingsData} />
            ) : (
              <p>No data available for average ratings.</p>
            )}
          </div>

          <div className="chart-container">
            <h3>Top Products by Ratings</h3>
            {topRatingsData.datasets.length > 0 ? (
              <Pie data={topRatingsData} />
            ) : (
              <p>No data available for top-rated products.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VendorDashboard;
