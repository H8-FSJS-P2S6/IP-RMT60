const { sendMessageToDialogflow } = require("../helpers/dialogflow");
const { Lecture, Category, Op } = require("../models");

class ChatbotController {
  static async sendMessage(req, res, next) {
    try {
      const { message, sessionId } = req.body;

      if (!message) {
        throw { name: "BadRequest", message: "Message is required" };
      }

      // Kirim ke Dialogflow
      const dialogflowResponse = await sendMessageToDialogflow(
        message,
        sessionId
      );

      // Jika intent adalah pencarian kursus, kita bisa menambahkan data dari database
      if (dialogflowResponse.intent === "course_info" || dialogflowResponse.intent === "course_search") {
        // Extract course type parameter - handle different Dialogflow parameter structures
        let courseType;
        
        // Check parameters structure and extract course type
        if (dialogflowResponse.parameters && dialogflowResponse.parameters['course-type']) {
          const param = dialogflowResponse.parameters['course-type'];
          courseType = param.stringValue || param.listValue?.values?.[0]?.stringValue || param;
        }

        if (courseType) {
          console.log(`Searching for courses with technique like: ${courseType}`);
          
          // Cari data kursus dari database berdasarkan parameter
          const courses = await Lecture.findAll({
            where: {
              [Op.or]: [
                { technique: { [Op.iLike]: `%${courseType}%` } },
                { name: { [Op.iLike]: `%${courseType}%` } }
              ]
            },
            include: [{ model: Category, as: "category" }],
            limit: 3,
          });

          console.log(`Found ${courses.length} courses matching "${courseType}"`);

          // Tambahkan data kursus ke respons
          if (courses.length > 0) {
            dialogflowResponse.courses = courses.map((course) => ({
              id: course.id,
              name: course.name,
              technique: course.technique,
              price: course.price,
              category: course.category?.name,
            }));
          } else {
            // No courses found
            dialogflowResponse.noCourses = true;
          }
        }
      }

      res.status(200).json(dialogflowResponse);
    } catch (error) {
      console.log("Chatbot error", error);
      next(error);
    }
  }
}

module.exports = ChatbotController;
