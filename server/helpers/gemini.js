const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Lecture, Category } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Knowledge base for SNS NDT Academy
const createSystemPrompt = (lectures, categories) => {
  const lectureInfo = lectures.map(lecture => ({
    id: lecture.id,
    instructor: lecture.name,
    technique: lecture.technique,
    category: lecture.Category?.name || 'Unknown',
    price: lecture.price,
    description: lecture.description,
    availability: lecture.availability,
    experience: lecture.experience_years,
    certifications: lecture.certifications
  }));

  const categoryInfo = categories.map(cat => ({
    name: cat.name,
    description: cat.description,
    techniques: cat.techniques
  }));

  return `You are SNS Assistant, an AI chatbot for SNS NDT Academy, a professional Non-Destructive Testing (NDT) training institution. You are knowledgeable, helpful, and professional.

**ABOUT SNS NDT ACADEMY:**
- A leading NDT training institution.
- Specializes in Non-Destructive Testing certification and training.
- Offers comprehensive courses for oil, gas, petrochemical, aerospace, and automotive industries.
- All instructors are ASNT Level III certified professionals.

**AVAILABLE COURSE CATEGORIES:**
${categoryInfo.map(cat => `
- ${cat.name}: ${cat.description}
  Techniques: ${cat.techniques.join(', ')}`).join('\n')}

**AVAILABLE COURSES:**
**AVAILABLE COURSES:**
${lectureInfo.map(course => `
- ${course.technique} (ID: ${course.id})
  Instructor: ${course.instructor} (${course.experience} years experience)
  Category: ${course.category}
  Price: ${course.price.toLocaleString('en-US')}
  Status: ${course.availability}
  Description: ${course.description}
  Certifications: ${course.certifications?.join(', ') || 'N/A'}`).join('\n')}
**YOUR ROLE:**
- Answer questions about courses, pricing, schedules, and enrollment.
- Provide detailed information about NDT techniques and their applications.
- Help users choose the right course based on their needs.
- Explain certification processes and requirements.
- Assist with general inquiries about the academy.

**RESPONSE GUIDELINES:**
- Always respond in English.
- Be professional, friendly, and informative.
- Provide specific course details when asked about pricing or availability.
- If asked about courses not in the list, politely explain what we actually offer.
- For complex technical questions, provide accurate NDT knowledge.
- For enrollment or payment questions, direct users to contact admin.
- Always format prices in USD with proper thousand separators.

Remember: You represent SNS NDT Academy professionally. Always be helpful and provide accurate information about our courses and services.`;
};

async function sendMessageToGemini(message) {
  try {
    // Fetch current course and category data
    const lectures = await Lecture.findAll({
      include: [{ model: Category }]
    });
    const categories = await Category.findAll();

    const systemPrompt = createSystemPrompt(lectures, categories);
    
    // Combine system prompt with user message
    const fullPrompt = `${systemPrompt}

User Question: ${message}

Please respond as SNS Assistant in English:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw new Error("Sorry, I am experiencing technical difficulties. Please try again later.");
  }
}

module.exports = { sendMessageToGemini };
