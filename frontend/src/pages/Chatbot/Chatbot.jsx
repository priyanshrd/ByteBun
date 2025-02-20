import React, { useState } from "react";
import "./Chatbot.css"; // Import a CSS file for styling

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Predefined Q&A
  const qaPairs = {
    "how do i cancel my order": "You can cancel your order by visiting the 'My Orders' page and selecting 'Cancel Order.'",
    "list my order details": "Please visit the 'My Orders' page to view all your order details.",
    "why can't i get my delivery status": "Delivery status updates may take up to 24 hours. If the issue persists, contact support.",
    "how do i contact customer support": "You can contact customer support at support@yourwebsite.com or call +1-800-123-4567.",
    "what are your delivery hours": "We deliver from 9 AM to 9 PM, Monday to Saturday.",
    "how do i update my payment method": "You can update your payment method in the 'Payment Settings' section of your account.",
    "where is my order": "You can track your order in the 'My Orders' section. If you need help, contact support.",
    "how do i apply a discount code": "Enter your discount code at checkout under the 'Apply Discount' section.",
    "what is your return policy": "You can return items within 30 days of delivery. Visit the 'Returns' page for details.",
    "how do i change my delivery address": "You can update your delivery address in the 'Account Settings' page.",
    "what payment methods do you accept": "We accept credit/debit cards, PayPal, and other popular payment methods.",
    "can i modify my order after placing it": "Unfortunately, orders cannot be modified after they are placed. Please contact support for assistance.",
    "do you offer international shipping": "Yes, we offer international shipping. Additional fees may apply.",
    "how do i track my order": "You can track your order in the 'My Orders' section of your account.",
    "what should i do if my order is delayed": "If your order is delayed, please contact support for assistance.",
  };

  // Predefined questions for buttons
  const predefinedQuestions = [
    "How do I cancel my order?",
    "List my order details.",
    "Why can't I get my delivery status?",
    "What are your delivery hours?",
    "How do I contact customer support?",
    "What payment methods do you accept?",
    "Can I modify my order after placing it?",
    "Do you offer international shipping?",
    "How do I track my order?",
    "What should I do if my order is delayed?",
  ];

  // Function to normalize user input
  const normalizeInput = (input) => {
    return input
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .trim(); // Remove extra spaces
  };

  // Function to find the best match for the user's input
  const findBestMatch = (userInput) => {
    const normalizedInput = normalizeInput(userInput);

    // Check for exact match
    if (qaPairs[normalizedInput]) {
      return qaPairs[normalizedInput];
    }

    // Check for partial match (fuzzy matching)
    for (const [question, answer] of Object.entries(qaPairs)) {
      if (normalizedInput.includes(question) || question.includes(normalizedInput)) {
        return answer;
      }
    }

    // No match found
    return null;
  };

  const sendMessage = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    const newMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Find the best match for the user's input
    const botReply = findBestMatch(userMessage) || "Sorry, I don't understand that question. Please contact customer care at support@bytebun.com or call +91-76764-33089 for further assistance.";

    // Simulate a delay for the bot's response
    setTimeout(() => {
      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    }, 500);
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <div className="chat-header">
          <h2>ByteBunny</h2>
          <p>How can I help you today?</p>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
        </div>

        <div className="predefined-questions">
          {predefinedQuestions.map((question, index) => (
            <button
              key={index}
              className="question-button"
              onClick={() => sendMessage(question)}
            >
              {question}
            </button>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;