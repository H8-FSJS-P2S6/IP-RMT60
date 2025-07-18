const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Lecture, Category, Lesson } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Enhanced knowledge base for SNS NDT Academy
const createSystemPrompt = (lectures, categories) => {
  // Detailed lecture info including lessons
  const lectureInfo = lectures.map(lecture => {
    const lessonTitles = lecture.Lessons && lecture.Lessons.length > 0
      ? lecture.Lessons.map(l => l.title).join(', ')
      : 'Details not available';

    return {
      id: lecture.id,
      instructor: lecture.name,
      technique: lecture.technique,
      category: lecture.Category?.name || 'Unknown',
      price: lecture.price,
      description: lecture.description,
      availability: lecture.availability,
      experience: lecture.experience_years,
      certifications: lecture.certifications,
      lessons: lessonTitles
    };
  });

  const categoryInfo = categories.map(cat => ({
    name: cat.name,
    description: cat.description,
    techniques: cat.techniques
  }));

  // Restructured and more detailed prompt
  return `You are SNS Assistant, an expert AI chatbot for SNS NDT Academy, a premier Non-Destructive Testing (NDT) training institution. Your goal is to be knowledgeable, helpful, and professional.

**Institutional Profile:**
- **Name:** SNS NDT Academy
- **Specialization:** Non-Destructive Testing (NDT) certification and training.
- **Target Industries:** Oil & Gas, Petrochemical, Aerospace, Automotive.
- **Instructor Quality:** All instructors are ASNT Level III certified professionals.

**Available Course Categories:**
${categoryInfo.map(cat => `
- **${cat.name}**: ${cat.description}
  *Techniques Covered*: ${cat.techniques.join(', ')}`).join('\n')}

**Detailed Course Offerings:**
${lectureInfo.map(course => `
---
- **Course ID:** ${course.id}
- **Course Name:** ${course.technique}
- **Instructor:** ${course.instructor} (${course.experience} years of experience)
- **Category:** ${course.category}
- **Price:** ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(course.price)}
- **Availability:** ${course.availability}
- **Certifications:** ${course.certifications?.join(', ') || 'N/A'}
- **Description:** ${course.description}
- **Curriculum Overview:** ${course.lessons}
---`).join('\n')}

**Your Role & Guidelines:**
1.  **Primary Function:** Answer user questions about courses (content, price, schedule), NDT techniques, enrollment, and certification.
2.  **Tone:** Maintain a professional, friendly, and informative tone. All responses must be in English.
3.  **Data Usage:** Base your answers on the detailed information provided above. For questions about topics not covered, politely state that the information is not available or guide the user to what you *do* know.
4.  **Pricing:** Always format prices in USD with thousand separators (e.g., $1,500).
5.  **Enrollment/Payment:** For direct enrollment or payment queries, guide the user to contact an administrator for the next steps. Do not process payments or registrations yourself.
6.  **Be Specific:** When asked about a course, use the detailed information, including the curriculum overview, to give a comprehensive answer.

You are the front-line representative of SNS NDT Academy. Your accuracy and professionalism are key.`;
};

async function sendMessageToGemini(message) {
  try {
    // Fetch all necessary data in parallel for efficiency
    const [lectures, categories] = await Promise.all([
      Lecture.findAll({
        include: [
          { model: Category, attributes: ['name'] },
          { model: Lesson, attributes: ['title'] }
        ]
      }),
      Category.findAll()
    ]);

    if (!lectures || lectures.length === 0) {
      console.error("No lecture data found in the database.");
      throw new Error("Course data is currently unavailable.");
    }

    const systemPrompt = createSystemPrompt(lectures, categories);
    
    const fullPrompt = `${systemPrompt}

User Question: "${message}"

SNS Assistant Response:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      console.warn("Received empty response from Gemini API for prompt:", message);
      throw new Error("Empty response from AI");
    }

    return text;
  } catch (error) {
    // Log the detailed error for debugging
    console.error("Error in sendMessageToGemini:", {
      message: error.message,
      stack: error.stack,
      originalUserMessage: message
    });
    
    // Return a more specific error to the controller
    throw new Error(`Failed to get a response from the AI service. Reason: ${error.message}`);
  }
}

module.exports = { sendMessageToGemini };
