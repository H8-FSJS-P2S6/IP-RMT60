const { DiscussServiceClient } = require('@google-ai/generativelanguage');
const { GoogleAuth } = require('google-auth-library');

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_AI_API_KEY),
});

const getTruckRecommendation = async (req, res, next) => {
  try {
    const { weight } = req.body;

    const prompt = `Based on a cargo weight of ${weight} kg, recommend the most suitable truck type from these options: pickup, box, flatbed, refrigerated. Provide a brief explanation.`;

    const [response] = await client.generateMessage({
      model: 'models/chat-bison-001',
      prompt: { messages: [{ content: prompt }] },
    });

    res.json({
      recommendation: response.candidates[0].content,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTruckRecommendation };