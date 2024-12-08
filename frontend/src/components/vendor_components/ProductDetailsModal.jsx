import React, { useState } from "react";
import "../../Styles/components/productdetailsmodal.css";
import axios from "axios";

const ProductDetailsModal = ({ product, handleClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [replies, setReplies] = useState({}); // To store replies for each review
  const [updatedProduct, setUpdatedProduct] = useState(product); // To update product data dynamically
  const [highlightedFields, setHighlightedFields] = useState({});

  const addReplyToReview = async (
    productId,
    reviewIndex,
    replyText,
    repliedBy
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/vendor/review-reply/${productId}/review/${reviewIndex}/reply`,
        {
          replyText,
          repliedBy,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply. Please try again.");
      return null;
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleReplyChange = (index, value) => {
    setReplies({ ...replies, [index]: value });
  };

  const handleReplySubmit = async (index) => {
    if (!replies[index]) {
      // Highlight the input field if empty
      setHighlightedFields({ ...highlightedFields, [index]: true });
      setTimeout(() => {
        setHighlightedFields({ ...highlightedFields, [index]: false });
      }, 2000); // Remove the highlight after 2 seconds
      return;
    }

    const repliedBy = "Vendor"; // Replace with the current user's name or role
    const productId = product._id;

    const result = await addReplyToReview(
      productId,
      index,
      replies[index],
      repliedBy
    );

    if (result) {
      // Update product's state with the new reply
      const updatedReviews = [...updatedProduct.reviews];
      updatedReviews[index].replies.push({
        replyText: replies[index],
        repliedBy,
      });

      setUpdatedProduct({ ...updatedProduct, reviews: updatedReviews });
      setReplies({ ...replies, [index]: "" }); // Clear the reply input field
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>
          ✖
        </button>
        <h2 className="modal-title">{product.name}</h2>
        <div className="image-slider">
          <button className="prev-button" onClick={handlePrevImage}>
            ◀
          </button>
          <img
            src={`http://localhost:5000/${product.images[currentImageIndex]}`}
            alt={product.name}
            className="product-image"
          />
          <button className="next-button" onClick={handleNextImage}>
            ▶
          </button>
        </div>
        <div className="image-indicators">
          {product.images.map((_, index) => (
            <span
              key={index}
              className={`indicator ${
                index === currentImageIndex ? "active" : ""
              }`}
            ></span>
          ))}
        </div>
        <p className="product-description">{product.description}</p>
        <p className="product-price">💲 {product.price}</p>
        <p className="product-stock">📦 Stock: {product.stock}</p>
        <p className="product-stock">💹 Sales: {product.sales}</p>
        <p className="product-category">Category: {product.category}</p>
        <p className="product-avgrating">
          ⭐ Average Rating: {product.avgratings}/5
        </p>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3 className="reviews-title">Customer Reviews</h3>
          <div className="review-box">
            {updatedProduct.reviews.length > 0 ? (
              updatedProduct.reviews.map((review, index) => (
                <div className="review" key={index}>
                  <h4 className="review-customer-name">
                    {review.customerName}
                  </h4>
                  <p className="review-text">{review.reviewText}</p>
                  {/* Replies Section */}
                  <div className="replies-list">
                    {review.replies &&
                      review.replies.map((reply, replyIndex) => (
                        <p key={replyIndex} className="reply">
                          <strong>{reply.repliedBy}:</strong> {reply.replyText}
                        </p>
                      ))}
                  </div>
                  <div className="reply-section">
                    <input
                      type="text"
                      value={replies[index] || ""}
                      onChange={(e) => handleReplyChange(index, e.target.value)}
                      className={`reply-input ${
                        highlightedFields[index] ? "highlighted" : ""
                      }`}
                      placeholder="Write a reply..."
                    />
                    <button
                      onClick={() => handleReplySubmit(index)}
                      className="reply-button"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
