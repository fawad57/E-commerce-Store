import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../Styles/vendorpages/VendorMaintenanceManagement.css";

const VendorMaintenanceManagement = () => {
  const [products, setProducts] = useState([]); // Fetch products instead of properties
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract vendorId from query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vendor/maintenance-requests/${vendorId}`
        );
        setProducts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching maintenance requests:", err);
        setError("Failed to load maintenance requests.");
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, [vendorId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleStatusChange = async (productId, requestId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/vendor/maintenance-requests/${productId}/request/${requestId}/status`,
        { status: newStatus }
      );

      // Update the product data after status change
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                maintenanceRequests: product.maintenanceRequests.map(
                  (request) =>
                    request._id === requestId
                      ? { ...request, status: newStatus }
                      : request
                ),
              }
            : product
        )
      );
    } catch (error) {
      console.error("Error updating maintenance request status:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="maintenance-requests-page">
        <h1>Maintenance Requests for Products</h1>
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card_1" key={product._id}>
              {/* Product Info */}
              <div className="product-info_1">
                {product.images.length > 0 && (
                  <img
                    src={`http://localhost:5000/${product.images[0]}`}
                    alt={product.name}
                    className="product-image_1"
                  />
                )}
                <div className="product-details_1">
                  <h2>{product.name}</h2>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {product.stock}
                  </p>
                </div>
              </div>
              {/* Maintenance Requests */}
              <div className="maintenance-requests">
                <h3>Maintenance Requests:</h3>
                {product.maintenanceRequests.map((request) => (
                  <div className="request-card" key={request._id}>
                    <p>
                      <strong>Request:</strong> {request.requestText}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleStatusChange(
                            product._id,
                            request._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </p>
                    <p>
                      <strong>Requested By:</strong>{" "}
                      {request.requestedBy ? (
                        <>
                          {request.requestedBy.name} (
                          {request.requestedBy.email})
                        </>
                      ) : (
                        "Unknown"
                      )}
                    </p>

                    <p>
                      <strong>Requested On:</strong>{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No maintenance requests found for your products.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VendorMaintenanceManagement;
