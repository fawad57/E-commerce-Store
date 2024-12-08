const express = require("express");
const router = express.Router();

const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");

router.post("/chat", async (req, res) => {
  const { productId, customerName, vendorId } = req.body;

  try {
    let chat = await Chat.findOne({ productId, customerName, vendorId });

    if (!chat) {
      chat = new Chat({ productId, customerName, vendorId });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
});

router.get("/chats/:vendorId", async (req, res) => {
  try {
    const chats = await Chat.find({ vendorId: req.params.vendorId }).sort({
      lastUpdated: -1,
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
});

router.post("/message", async (req, res) => {
  const { chatId, senderName, message } = req.body;

  try {
    const newMessage = new Message({ chatId, senderName, message });
    await newMessage.save();

    await Chat.findByIdAndUpdate(
      chatId,
      { lastMessage: message, lastUpdated: Date.now() },
      { new: true }
    );

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
});

router.get("/messages/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      timestamp: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

module.exports = router;
