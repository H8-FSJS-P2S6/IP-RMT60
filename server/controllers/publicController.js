const { Category, Lecture, User, sequelize } = require("../models");
const { Op } = require("sequelize");

class PublicController {
  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll({
        attributes: {
          include: [
            [sequelize.fn("COUNT", sequelize.col("Lectures.id")), "lectureCount"]
          ]
        },
        include: [
          {
            model: Lecture,
            attributes: []
          }
        ],
        group: ["Category.id"]
      });
      
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }
  
  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id, {
        attributes: {
          include: [
            [sequelize.fn("COUNT", sequelize.col("Lectures.id")), "lectureCount"]
          ]
        },
        include: [
          {
            model: Lecture,
            attributes: []
          }
        ],
        group: ["Category.id"]
      });
      
      if (!category) {
        throw { name: "NotFound", message: "Category not found" };
      }
      
      res.json(category);
    } catch (err) {
      next(err);
    }
  }
  
  static async getLectures(req, res, next) {
    try {
      const {
        page = 1,
        limit = 9,
        search = "",
        categoryId,
        minPrice,
        maxPrice,
        sortBy = "createdAt",
        sortDirection = "DESC"
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Build where clause for filtering
      const whereClause = {};
      if (search) {
        whereClause.name = { [Op.iLike]: `%${search}%` };
      }
      
      if (categoryId) {
        whereClause.CategoryId = categoryId;
      }
      
      // Price filtering
      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = minPrice;
        if (maxPrice) whereClause.price[Op.lte] = maxPrice;
      }
      
      const { count, rows } = await Lecture.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: 'category'
          },
          {
            model: User,
            attributes: ['username'],
            required: false
          }
        ],
        order: [[sortBy, sortDirection]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      // Calculate pagination info
      const totalItems = count;
      const totalPages = Math.ceil(totalItems / limit);
      
      res.json({
        lectures: rows,
        currentPage: parseInt(page),
        totalPages,
        totalItems
      });
    } catch (err) {
      console.error("Error in getLectures:", err);
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
            as: 'category'
          }
        ]
      });
      
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      res.json(lecture);
    } catch (err) {
      next(err);
    }
  }
  
  static async getHomepageBundle(req, res, next) {
    try {
      // Get featured lectures (explicitly selecting only existing columns)
      const featuredLectures = await Lecture.findAll({
        attributes: [
          'id', 'name', 'title', 'technique', 'CategoryId', 
          'experience_years', 'certifications', 'description', 
          'price', 'availability', 'image', 'createdAt', 'updatedAt'
        ],
        include: [{
          model: Category,
          as: 'category'
        }],
        limit: 3,
        order: [['createdAt', 'DESC']]
      });
      
      // Get latest lectures (same as featured for now, could be different criteria)
      const latestLectures = await Lecture.findAll({
        attributes: [
          'id', 'name', 'title', 'technique', 'CategoryId', 
          'experience_years', 'certifications', 'description', 
          'price', 'availability', 'image', 'createdAt', 'updatedAt'
        ],
        include: [{
          model: Category,
          as: 'category'
        }],
        limit: 3,
        order: [['createdAt', 'DESC']]
      });
      
      // Get popular categories
      const popularCategories = await Category.findAll({
        limit: 3
      });
      
      // Get statistics
      const totalLectures = await Lecture.count();
      const totalCategories = await Category.count();
      const totalUsers = await User.count();
      
      res.json({
        featuredLectures,
        latestLectures,
        popularCategories,
        statistics: {
          totalLectures,
          totalCategories,
          totalUsers
        }
      });
    } catch (err) {
      console.error("Error in getHomepageBundle:", err);
      next(err);
    }
  }
}

module.exports = PublicController;