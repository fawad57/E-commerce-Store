import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/components/chatwindow.css";

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To track errors

  // Fetch messages when the chatId changes
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    setLoading(true); // Start loading
    axios
      .get(`http://localhost:5000/api/vendor/messages/messages/${chatId}`)
      .then((response) => {
        setMessages(response.data); // Update messages
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError("Error fetching messages");
        console.error("Error fetching messages:", error);
        setLoading(false); // Stop loading
      });
  }, [chatId]);

  // Handle sending a new message
  const sendMessage = () => {
    if (!newMessage.trim()) {
      return; // Prevent sending empty messages
    }

    axios
      .post("http://localhost:5000/api/vendor/messages/message", {
        chatId,
        senderName: "Vendor", // Replace "Vendor" with dynamic sender if needed
        message: newMessage,
      })
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response.data]); // Add the new message to the list
        setNewMessage(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setError("Error sending message");
      });
  };

  if (!chatId) {
    return (
      <div className="no-chat-selected">
        <p>No Chat Selected. Please select a chat to view messages.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Messages Section */}
      <div className="messages">
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${
                msg.senderName === "Vendor"
                  ? "vendor-message"
                  : "customer-message"
              }`}
            >
              <strong>{msg.senderName}:</strong> {msg.message}
            </div>
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>

      {/* Input and Send Button */}
      <div className="send-message">
        <input
          type="text"
          value={newMessage}
          placeholder="Type your message..."
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
