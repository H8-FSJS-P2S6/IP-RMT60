const { sendMessageToGemini } = require("../helpers/gemini");

class ChatbotController {
  static async sendMessage(req, res, next) {
    try {
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        throw { name: "BadRequest", message: "Message cannot be empty" };
      }

      // Validate message length
      if (message.length > 1000) {
        throw { name: "BadRequest", message: "Message too long. Maximum 1000 characters." };
      }

      // Log user interaction for analytics (optional)
      console.log(`Chatbot query: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);

      const geminiResponse = await sendMessageToGemini(message);

      // Ensure response is not empty
      if (!geminiResponse || geminiResponse.trim().length === 0) {
        throw new Error("Empty response from AI");
      }

      res.status(200).json({ 
        text: geminiResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Chatbot controller error:", error.message);

      const errorMessage = error.name === "BadRequest" 
        ? error.message
        : `Sorry, I encountered an issue. ${error.message}`;

      // It's good practice to send a 200 status even for handled errors
      // to avoid the client treating it as a failed HTTP request.
      res.status(200).json({
        text: errorMessage,
        timestamp: new Date().toISOString(),
        isError: true
      });
    }
  }

  // Health check endpoint for chatbot
  static async healthCheck(req, res) {
    try {
      res.status(200).json({ 
        status: "healthy", 
        service: "SNS Chatbot",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Chatbot service unavailable",
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = ChatbotController;