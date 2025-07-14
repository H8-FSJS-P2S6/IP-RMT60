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
      console.error("Chatbot error:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "Sorry, I am experiencing technical difficulties. Please try again later.";
      
      if (error.name === "BadRequest") {
        errorMessage = error.message;
      } else if (error.message && error.message.includes("API")) {
        errorMessage = "The chatbot service is currently unavailable. Please contact an admin for direct assistance.";
      }
      
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