import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import {
  getCommunityChatMessages,
  sendCommunityChatMessage,
  getProfile,
} from "../../api";
import { AuthContext } from "../../context/authContext";
import { useTranslation } from "react-i18next";

const CommunityChat = () => {
  const { t } = useTranslation(); // Use i18n translation
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // Track if the user is at the bottom
  const chatBoxRef = useRef(null); // Create a reference for the chat box
  const [user, setUser] = useState(null); // State to store user profile
  const { isAuthenticated } = useContext(AuthContext); // Use authentication from context

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile(); // Fetch user profile from API
        setUser(userData.data); // Set user state
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  // Fetch messages initially and on interval
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getCommunityChatMessages();
        setMessages(response.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // Handle chat scroll and auto-scroll to bottom
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
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

      setIsAtBottom(scrollHeight - scrollTop === clientHeight);
    }
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await sendCommunityChatMessage({
        text: newMessage,
        sender: user.username,
      });
      setNewMessage(""); // Clear input field after sending
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <section className="hero-banner-bg">
      <div
        className="container"
        style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
      >
        <div style={styles.chatContainer}>
          <h2 style={styles.heading}>Community Chat</h2>
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
                }}
              >
                <strong>{msg.sender}</strong>: {msg.text}
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
            <p style={styles.loginPrompt}>{t("word31")}</p>
          )}
        </div>
      </div>
    </section>
  );
};

CommunityChat.propTypes = {
  campaignId: PropTypes.string,
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
    maxHeight: "800px",
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
  loginPrompt: {
    textAlign: "center",
    color: "#757575",
    fontSize: "14px",
  },
};

export default CommunityChat;
