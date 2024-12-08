const express = require("express");
const multer = require("multer");
const Product = require("../models/ProductModel");

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add product route
router.post("/add-product", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, category, stock, _id } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const imagePaths = req.files.map((file) => file.path);

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images: imagePaths,
      owner: _id, // The user ID (referencing the Members model)
    });

    const savedProduct = await product.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Route to get all products
router.get("/get_products/:vendorId", (req, res) => {
  Product.find({ owner: req.params.vendorId })
    .then((products) => {
      res.json({ products: products });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    });
});

// Delete a product
router.post("/delete-product", async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ message: "Product ID is required for deletion." });
    }
    const deletedProduct = await Product.findByIdAndDelete(_id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    console.error("Error deleting Product:", err);
    res.status(500).json({ message: "Server error while deleting Product." });
  }
});

// Update product details
router.post("/update_product", upload.array("images", 5), async (req, res) => {
  try {
    const {
      editProduct,
      title,
      description,
      price,
      stock,
      address,
      availability,
    } = req.body;
    if (!editProduct) {
      console.log(2);
      return res
        .status(400)
        .json({ message: "Product ID is required for updating." });
    }

    const images = req.files.map((file) => file.path);

    // Set the picture if a new one is provided
    const updatedData = {
      title,
      description,
      price,
      address,
      availability,
      stock,
      images,
    };

    const _id = editProduct;

    // Update the product in the database
    const updatedproduct = await Product.findByIdAndUpdate(_id, updatedData, {
      new: true, // Return updated product after the update
    });

    res.status(200).json({
      message: "product updated successfully!",
      product: updatedproduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Server error while updating product." });
  }
});

module.exports = router;
