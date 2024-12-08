const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const MemberModel = require("../models/Members");

const router = express.Router();

const accountSid = process.env.sid;
const authToken = process.env.token;
const client = require("twilio")(accountSid, authToken);

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

router.post(
  "/upload-profile-picture",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const email = req.body.email;
      const profilePicPath = `uploads\\${req.file.filename}`;

      const result = await MemberModel.updateOne(
        { email: email },
        {
          $set: { profilePicture: profilePicPath },
        }
      );

      if (result.nModified === 0) {
        return res.json({
          message: "User not found or profile picture was not updated",
        });
      }
      // Send a Twilio SMS to the user with a link to their updated profile picture
      const customerPhoneNumber = result.phone; // Assuming 'phone' field exists on the requestedBy object
      const customerName = result.name;

      const number = "+92" + customerPhoneNumber.slice(1);

      const message = `Hello ${customerName},\n\nYour profile picture has been successfully updated! Thank you for keeping your profile up-to-date.\n\nFeel free to let us know if there's anything else we can assist you with.`;

      // Send the SMS via Twilio

      client.messages.create({
        body: message,
        messagingServiceSid: process.env.ssid,
        to: number,
      });
      res.json({
        message: "Profile picture uploaded successfully!",
        profilePicPath,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({
        message: "An error occurred while uploading the profile picture",
        error: error.message,
      });
    }
  }
);

// Update Profile Route
router.post("/update-profile", async (req, res) => {
  const { name, username, email, phone, address, bio } = req.body;

  try {
    // Find the user by their email
    const user = await MemberModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile
    if (name) user.name = name;
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (bio) user.bio = bio;

    // Save the updated user
    await user.save();

    const customerPhoneNumber = user.phone; // Assuming 'phone' field exists on the requestedBy object
    const customerName = user.name;

    const number = "+92" + customerPhoneNumber.slice(1);

    // console.log(number);

    const message = `Hello ${customerName},\n\nYour profile details have been successfully updated! Thank you for keeping your information current.\n\nIf there's anything else we can assist you with, feel free to reach out.`;

    // Send the SMS via Twilio

    client.messages.create({
      body: message,
      messagingServiceSid: process.env.ssid,
      to: number,
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
});

// Route to update password
router.post("/update-password", async (req, res) => {
  const { currentPassword, newPassword, email } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // Find the user by email
    const user = await MemberModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    const customerPhoneNumber = user.phone; // Assuming 'phone' field exists on the requestedBy object
    const customerName = user.name;

    const number = "+92" + customerPhoneNumber.slice(1);

    const message = `Hello ${customerName},\n\nYour password has been successfully updated! For your security, please ensure your password remains confidential.\n\nIf you didn’t make this change or need assistance, contact us immediately.`;

    // Send the SMS via Twilio

    client.messages.create({
      body: message,
      messagingServiceSid: process.env.ssid,
      to: number,
    });

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
});

// Update account settings
router.post("/update-account-settings", async (req, res) => {
  try {
    const { email, notifications, accountVisibility, accountStatus } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const updatedUser = await MemberModel.findOneAndUpdate(
      { email }, // Match user by email
      {
        notifications,
        accountVisibility,
        accountStatus,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    await updatedUser.save();

    const customerPhoneNumber = updatedUser.phone; // Assuming 'phone' field exists on the requestedBy object
    const customerName = updatedUser.name;

    const number = "+92" + customerPhoneNumber.slice(1);

    const message = `Hello ${customerName},\n\nYour account settings have been successfully updated! Thank you for keeping your preferences up-to-date.\n\nIf you need any further assistance, feel free to reach out.`;

    // Send the SMS via Twilio

    client.messages.create({
      body: message,
      messagingServiceSid: process.env.ssid,
      to: number,
    });

    res.json({
      success: true,
      message: "Account settings updated successfully.",
    });
  } catch (error) {
    console.error("Error updating account settings:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
