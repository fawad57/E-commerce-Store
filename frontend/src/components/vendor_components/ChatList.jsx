import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatList = ({ vendorId, onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log(vendorId);
    axios
      .get(`http://localhost:5000/api/vendor/messages/chats/${vendorId}`)
      .then((response) => setChats(response.data))
      .catch((error) => console.error("Error fetching chats:", error));
  }, [vendorId]);

  const filteredChats = chats.filter((chat) =>
    chat.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-list">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by customer name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className="chat-item"
          >
            <p>{chat.customerName}</p>
            <p>{chat.lastMessage}</p>
          </div>
        ))
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
};

export default ChatList;
