const { sendMessageToDialogflow } = require('../helpers/dialogflow');
const { Lecture, Category } = require('../models');

class ChatbotController {

  static async sendMessage(req, res, next) {
    try {
      const { message, sessionId } = req.body;

      if (!message) {
        throw { name: 'BadRequest', message: 'Message is required' };
      }

      // Kirim ke Dialogflow
      const dialogflowResponse = await sendMessageToDialogflow(message, sessionId);

      // Jika intent adalah pencarian kursus, kita bisa menambahkan data dari database
      if (dialogflowResponse.intent === 'course_info') {
        const courseType = dialogflowResponse.parameters?.['course-type']?.stringValue;
        
        if (courseType) {
          // Cari data kursus dari database berdasarkan parameter
          const courses = await Lecture.findAll({
            where: {
              technique: {
                [Op.iLike]: `%${courseType}%` 
              }
            },
            include: [{ model: Category, as: 'category' }],
            limit: 3
          });
          
          // Tambahkan data kursus ke respons
          if (courses.length > 0) {
            dialogflowResponse.courses = courses.map(course => ({
              id: course.id,
              name: course.name,
              technique: course.technique,
              price: course.price,
              category: course.category?.name
            }));
          }
        }
      }

      res.status(200).json(dialogflowResponse);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatbotController;