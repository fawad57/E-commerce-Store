const express = require("express");
const Product = require("../models/ProductModel");
const Member = require("../models/Members");
const dotenv = require("dotenv");

const router = express.Router();

const accountSid = process.env.sid;
const authToken = process.env.token;
const client = require("twilio")(accountSid, authToken);

// Get all properties with maintenance requests for a specific owner
router.get("/:vendorId", async (req, res) => {
  try {
    const ownerId = req.params.vendorId; // Get the ownerId from the query parameters
    // Validate if ownerId is provided
    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message:
          "Owner ID is required to fetch properties with maintenance requests.",
      });
    }

    // Find properties for the given owner that have at least one maintenance request
    const products = await Product.find({
      owner: ownerId, // Filter by ownerId
      "maintenanceRequests.0": { $exists: true }, // Ensure the Product has at least one maintenance request
    })
      .populate("maintenanceRequests.requestedBy", "name email") // Populate the requestedBy field with the name and email
      .select("name category price stock maintenanceRequests images"); // Select relevant fields

    // If no properties are found
    if (products.length === 0) {
      return res.json({
        success: false,
        message:
          "No properties found for this owner with maintenance requests.",
      });
    }

    res.status(200).json(products); // Return the properties with maintenance requests
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({ success: false, message: "Server error." }); // Handle server error
  }
});

// Update status of a specific maintenance request
router.put("/:ProductId/request/:requestId/status", async (req, res) => {
  try {
    const { ProductId, requestId } = req.params;
    const { status } = req.body; // Get the new status

    // Check if the status is valid
    if (!status || !["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    // Find the Product by ID
    const product = await Product.findById(ProductId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Find the maintenance request within the Product
    const maintenanceRequest = product.maintenanceRequests.id(requestId);

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found.",
      });
    }

    // Update the status of the request
    maintenanceRequest.status = status;

    // Save the Product with the updated request
    await product.save();

    // Send SMS notification to the customer

    const member = await Member.findById(maintenanceRequest.requestedBy);

    const customerPhoneNumber = member.phone; // Assuming 'phone' field exists on the requestedBy object
    const customerName = member.name;

    const number = "+92" + customerPhoneNumber.slice(1);

    const messageBody = `Hello ${customerName},\nYour maintenance request for Product: ${product.name} has been updated to "${status}" status. Thank you for your patience.`;

    // Send the SMS via Twilio

    client.messages.create({
      body: messageBody,
      messagingServiceSid: process.env.ssid,
      to: number,
    });

    res.status(200).json({
      success: true,
      message: "Maintenance request status updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Error updating maintenance request status:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Endpoint to create a maintenance request
router.post("/:productId", async (req, res) => {
  const { productId } = req.params;
  const { requestText, requestedBy } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.maintenanceRequests.push({
      requestText,
      requestedBy,
      status: "Pending",
    });
    await product.save();

    res.status(200).json({
      message: "Maintenance request submitted successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit maintenance request" });
  }
});

module.exports = router;
