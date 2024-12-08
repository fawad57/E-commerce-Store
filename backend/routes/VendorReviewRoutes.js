const express = require("express");
const router = express.Router();
const Product = require("../models/ProductModel");

// Add a review to a product
router.post("/:productId/add-review", async (req, res) => {
  try {
    const { productId } = req.params;
    const { customerName, customerEmail, reviewText, rating } = req.body;

    // Validate input
    if (!customerName || !customerEmail || !reviewText || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Add the new review
    product.reviews.push({ customerName, customerEmail, reviewText, rating });

    // Update average ratings
    const totalRatings = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.avgratings = totalRatings / product.reviews.length;

    // Save the product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully!",
      product,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Add a reply to a specific review
router.post("/:productId/review/:reviewIndex/reply", async (req, res) => {
  try {
    const { productId, reviewIndex } = req.params;
    const { replyText, repliedBy } = req.body;

    if (!replyText || !repliedBy) {
      return res.status(400).json({
        success: false,
        message: "Reply text and repliedBy are required.",
      });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Validate review index
    if (!product.reviews[reviewIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    // Add the reply to the specified review
    const reply = {
      replyText,
      repliedBy,
      createdAt: new Date(),
    };
    product.reviews[reviewIndex].replies.push(reply);

    // Save the product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully!",
      review: product.reviews[reviewIndex],
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get all reviews for a product
router.get("/:productId/reviews", async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId).select("reviews");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
