const mongoose = require("mongoose");

// Define the Reply schema
const replySchema = new mongoose.Schema(
  {
    replyText: {
      type: String,
      required: [true, "Reply text is required"],
      maxlength: [500, "Reply cannot exceed 500 characters"],
    },
    repliedBy: {
      type: String, // The person who replied (could be the owner or admin)
      required: [true, "Replied by field is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Prevent Mongoose from automatically adding an _id field for replies
);

// Define the Review schema
const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    replies: [replySchema],
  },
  { _id: false } // Prevent Mongoose from automatically adding an _id field for reviews
);

const maintenanceRequestSchema = new mongoose.Schema({
  requestText: {
    type: String,
    required: [true, "Request text is required"],
    maxlength: [500, "Request cannot exceed 500 characters"],
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Members",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [500, "Description can't exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Electronics", "Clothing", "Home Appliances", "Books", "Other"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one image URL is required",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    avgratings: {
      type: Number,
      default: 0,
      min: [0, "Ratings cannot be less than 0"],
      max: [5, "Ratings cannot be more than 5"],
    },
    sales: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema], // Add reviews field
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members", // Reference to the User model
      required: true,
    },
    maintenanceRequests: [maintenanceRequestSchema],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
