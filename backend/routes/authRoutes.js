const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const MemberModel = require("../models/Members");

const dotenv = require("dotenv");
const JWT_SECRET = process.env.SECRET;
const router = express.Router();

const otpStore = {}; // Temporarily store OTPs here.+ Use a more secure method in production.

// Signup Route
router.post("/signup", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the member already exists
    const member = await MemberModel.findOne({ email: email });
    if (member) {
      // If the member exists, return a success message
      return res.json("Success");
    } else {
      const { name, password, phone } = req.body;

      // Hash the password using bcrypt
      const newpassword = await bcrypt.hash(password, 10); // Await the bcrypt.hash promise

      // Create a new member instance
      const newMember = new MemberModel({
        name: name,
        email: email,
        password: newpassword,
        phone: phone,
        username: email,
      });

      // Save the new member to the database
      const savedMember = await newMember.save(); // Use save method instead of create method
      return res.json(savedMember); // Return the saved member as a response
    }
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// Login Route

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  MemberModel.findOne({ email: email }).then((member) => {
    if (member) {
      const isMatch = bcrypt.compareSync(password, member.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            name: member.name,
            password: member.password,
            _id: member._id,
            email: member.email,
            role: member.role,
            picture: member.profilePicture,
            phone: member.phone,
            username: member.username,
            bio: member.bio,
            address: member.address,
          },
          JWT_SECRET,
          { expiresIn: "1h" } // Token expires in 1 hour
        );
        res.status(200).json({ message: "Login successful", token, member });
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No email exists");
    }
  });
});

// Verify OTP Route
router.post("/verify-otp", (req, res) => {
  const { email, code } = req.body;
  if (otpStore[email] && otpStore[email] == code) {
    res.status(200).json("OTP verified successfully");
  } else {
    res.status(400).json("Incorrect OTP");
  }
});

// Forgot Password Route
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  MemberModel.findOne({ email: email }).then((member) => {
    if (!member) {
      res.status(404).json("Incorrect email");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });

    const code = generateSixDigitCode();
    otpStore[email] = code; // Store OTP against the email.

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Reset Password",
      text: `Your OTP is: ${code}`,
      html: `<b>Your OTP is: ${code}</b>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json("Error sending email");
      } else {
        res.status(200).json("OTP sent successfully");
      }
    });
  });
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const newHashedPassword = bcrypt.hashSync(password, salt);

    await MemberModel.updateOne(
      { email: email },
      { $set: { password: newHashedPassword } }
    );
    res.json("Successfully changed");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Helper function to generate OTP
function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

router.post("/set-role", async (req, res) => {
  const { email, role } = req.body;

  try {
    const user = await MemberModel.findOne({ email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    user.role = role; // Set the user role
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Role updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating role" });
  }
});

module.exports = router;
