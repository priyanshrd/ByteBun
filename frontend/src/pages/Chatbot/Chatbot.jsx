import React, { useState } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(""); // State to store error messages

  const handleSend = async () => {
    if (!message) return;

    try {
      // Send the message to the backend
      const { data } = await axios.post(
        "http://192.168.247.109:4000/api/chatbot",
        { userMessage: message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
          },
        }
      );

      // Update the chat history
      setResponses([...responses, { user: message, bot: data.botReply }]);
      setMessage("");
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error sending message:", error);

      // Display a user-friendly error message
      setError("Oops! Something went wrong. Please try again.");

      // Optionally, log the error to a monitoring service
      // logErrorToService(error);

      // Ensure the chatbot remains functional
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerText}>ByteBunny [BETA]</h1>
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        {responses.map((res, index) => (
          <div key={index} className={styles.messageContainer}>
            <div className={styles.userMessage}>You: {res.user}</div>
            <div className={styles.botMessage}>Bot: {res.bot}</div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Input Area */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.input}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()} // Send message on Enter key
        />
        <button onClick={handleSend} className={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;