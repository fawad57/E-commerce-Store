const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const Members = require("../models/Members");

const router = express.Router();

// Example Protected Route
router.post("/verify-token", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});

router.post("/get_id", verifyToken, async (req, res) => {
  //find member by id
  const member = await Members.findById(req.user._id);
  res.json({ message: "This is protected route", user: member });
});

module.exports = router;
