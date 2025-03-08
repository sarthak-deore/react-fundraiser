import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { getMessages, sendMessage } from "../api";

const Chat = ({ campaignId, user, isAuthenticated, contributed, owner }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // Track if the user is at the bottom
  const chatBoxRef = useRef(null); // Create a reference for the chat box

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (contributed || user.admin) {
          const response = await getMessages(campaignId);
          setMessages(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages(); // Fetch messages initially

    const intervalId = setInterval(fetchMessages, 5000); // Poll every 2 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [campaignId, contributed, user]);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      // Check if the user is at the bottom
      const scrollHeight = chatBox.scrollHeight;
      const clientHeight = chatBox.clientHeight;
      const scrollTop = chatBox.scrollTop;

      if (scrollHeight - scrollTop === clientHeight) {
        setIsAtBottom(true);
      }

      if (isAtBottom) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      const scrollHeight = chatBox.scrollHeight;
      const clientHeight = chatBox.clientHeight;
      const scrollTop = chatBox.scrollTop;

      // Update isAtBottom based on scroll position
      if (scrollHeight - scrollTop === clientHeight) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await sendMessage(campaignId, {
        text: newMessage,
        sender: user.username,
      });
      setNewMessage(""); // Clear input field after sending
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h2 style={styles.heading}>Chatroom</h2>
      {contributed || user?.admin ? (
        <>
          <div
            ref={chatBoxRef}
            style={styles.chatBox}
            onScroll={handleScroll} // Add onScroll event listener
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.chatMessage,
                  ...(msg.sender === owner ? styles.ownerMessage : {}),
                }}
              >
                <strong>{msg.sender}</strong>
                {msg.sender === owner && (
                  <span style={styles.creatorTag}>Creator</span>
                )}
                : {msg.text}
              </div>
            ))}
          </div>
          {isAuthenticated ? (
            <div style={styles.chatInputContainer}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={styles.chatInput}
              />
              <button onClick={handleSendMessage} style={styles.sendButton}>
                Send
              </button>
            </div>
          ) : (
            <p style={styles.loginPrompt}>
              Please log in to participate in the chat.
            </p>
          )}
        </>
      ) : (
        <p style={styles.contributePrompt}>
          Please contribute to this campaign to access the chat.
        </p>
      )}
    </div>
  );
};

Chat.propTypes = {
  campaignId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  contributed: PropTypes.bool.isRequired,
  owner: PropTypes.string.isRequired,
};

const styles = {
  chatContainer: {
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#1e1e1e",
    width: "100%",
    maxWidth: "1000px",
    margin: "20px auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  heading: {
    color: "#ffffff",
    marginBottom: "16px",
    fontSize: "24px",
    textAlign: "center",
  },
  chatBox: {
    maxHeight: "400px",
    overflowY: "scroll",
    borderBottom: "1px solid #333",
    paddingBottom: "8px",
    marginBottom: "12px",
    backgroundColor: "#2a2a2a",
    borderRadius: "4px",
    padding: "10px",
    color: "#e0e0e0",
  },
  chatMessage: {
    marginBottom: "10px",
    padding: "8px 12px",
    borderRadius: "12px",
    backgroundColor: "#444",
    color: "#e0e0e0",
    wordBreak: "break-word",
    position: "relative", // Ensure the tag is positioned correctly
  },
  ownerMessage: {
    border: "2px solid #007bff", // Highlight owner messages with a blue border
    backgroundColor: "#555", // Slightly different background for owner messages
  },
  creatorTag: {
    marginLeft: "8px",
    padding: "2px 6px",
    borderRadius: "12px",
    backgroundColor: "green",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "bold",
    position: "left",
    top: "0",
    right: "0",
    transform: "translate(50%, -50%)",
  },
  chatInputContainer: {
    display: "flex",
    alignItems: "center",
    borderTop: "1px solid #333",
    paddingTop: "8px",
  },
  chatInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "20px",
    backgroundColor: "#333",
    color: "#e0e0e0",
    fontSize: "14px",
    marginRight: "8px",
  },
  sendButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "20px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  sendButtonHover: {
    backgroundColor: "#0056b3",
  },
  loginPrompt: {
    textAlign: "center",
    color: "#757575",
    fontSize: "14px",
  },
  contributePrompt: {
    textAlign: "center",
    color: "#757575",
    fontSize: "14px",
  },
};

export default Chat;
