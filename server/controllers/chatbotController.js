const { sendMessageToGemini } = require("../helpers/gemini");

class ChatbotController {
  static async sendMessage(req, res, next) {
    try {
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        throw { name: "BadRequest", message: "Pesan tidak boleh kosong" };
      }

      // Validate message length
      if (message.length > 1000) {
        throw { name: "BadRequest", message: "Pesan terlalu panjang. Maksimal 1000 karakter." };
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
      let errorMessage = "Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi nanti.";
      
      if (error.name === "BadRequest") {
        errorMessage = error.message;
      } else if (error.message && error.message.includes("API")) {
        errorMessage = "Layanan chatbot sedang tidak tersedia. Silakan hubungi admin untuk bantuan langsung.";
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