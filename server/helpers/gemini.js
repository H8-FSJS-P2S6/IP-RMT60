const { GoogleGenAI } = require("@google/genai");

// Inisialisasi dengan API key dari environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Fungsi untuk menggenerate konten menggunakan AI
 * @param {string} contents - Konten yang ingin dijelaskan oleh AI
 * @param {string} model - Model yang digunakan oleh AI, misalnya "gemini-2.0-flash"
 * @returns {string} - Balasan AI
 */
async function generateContent(contents, model = "gemini-2.0-flash") {
  try {
    const response = await ai.models.generateContent({
      model,
      contents,
    });
    return response.text; // Balasannya berupa teks
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content from AI");
  }
}

module.exports = {
  generateContent,
};
