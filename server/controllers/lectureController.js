const { Lecture, Category, User } = require("../models");

class LectureController {
  static async getAllLectures(req, res, next) {
    try {
      const lectures = await Lecture.findAll({
        include: [
          {
            model: Category,
            as: "category"
          },
          {
            model: User,
            attributes: ["username", "email"]
          }
        ],
        order: [["id", "ASC"]]
      });
      
      res.status(200).json(lectures);
    } catch (err) {
      next(err);
    }
  }

  static async getLectureById(req, res, next) {
    try {
      const { id } = req.params;
      const lecture = await Lecture.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category"
          },
          {
            model: User,
            attributes: ["username", "email"]
          }
        ]
      });
      
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      res.status(200).json(lecture);
    } catch (err) {
      next(err);
    }
  }

  static async createLecture(req, res, next) {
    try {
      const {
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image
      } = req.body;
      
      // Set the current admin as the lecture creator
      const UserId = req.user.id;
      
      const newLecture = await Lecture.create({
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image,
        UserId
      });
      
      res.status(201).json(newLecture);
    } catch (err) {
      next(err);
    }
  }

  static async updateLecture(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image
      } = req.body;
      
      const lecture = await Lecture.findByPk(id);
      
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      await lecture.update({
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image
      });
      
      res.status(200).json(lecture);
    } catch (err) {
      next(err);
    }
  }

  static async deleteLecture(req, res, next) {
    try {
      const { id } = req.params;
      const lecture = await Lecture.findByPk(id);
      
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      await lecture.destroy();
      
      res.status(200).json({ message: "Lecture deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LectureController;