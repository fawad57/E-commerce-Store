const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, // Email is usually required
  },
  password: {
    type: String,
    required: true, // Ensure a password is always provided
    minlength: 8, // Minimum password length
  },
  phone: {
    type: String,
  },
  username: {
    type: String,
    default: null,
    unique: true, // Ensure unique usernames
    sparse: true, // Allow multiple documents with `null` as username
  },
  bio: {
    type: String,
    maxlength: 300, // Limit the bio length
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "customer", // Default role
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  notifications: {
    type: Boolean,
    default: true, // Enable notifications by default
  },
  accountVisibility: {
    type: String,
    enum: ["public", "private"], // Restrict visibility options
    default: "public", // Default visibility is public
  },
  accountStatus: {
    type: String,
    enum: ["active", "inactive", "suspended"], // Status options
    default: "active", // Default status is active
  },
});

const MemberModel = mongoose.model("Members", MemberSchema);
module.exports = MemberModel;
