const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();

const connectDB = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const protectedRoute = require("./routes/protectedRoutes");

//Vendor Routes
const vendorProductRoutes = require("./routes/vendorProductsRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const vendorReviewRoutes = require("./routes/VendorReviewRoutes");
const CommunicationRoutes = require("./routes/CommunicationRoutes");
const VendorMaintenanceRoutes = require("./routes/VendorMaintenaceRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/protected", protectedRoute);
app.use("/api/auth", authRoutes);

//Vendor Routes
app.use("/api/vendor/products", vendorProductRoutes);
app.use("/api/vendor/userprofile", userProfileRoutes);
app.use("/api/vendor/review-reply", vendorReviewRoutes);
app.use("/api/vendor/messages", CommunicationRoutes);
app.use("/api/vendor/maintenance-requests", VendorMaintenanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
