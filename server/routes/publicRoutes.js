const express = require("express");
const router = express.Router();
const { Lecture, Category, User, sequelize } = require("../models");
const { Op } = require("sequelize");

// Get landing page bundle (all homepage data in one request)
router.get("/homepage-bundle", async (req, res, next) => {
  try {
    // Get featured lectures, latest lectures, statistics, and popular categories in parallel
    const [featuredLectures, latestLectures, statistics, popularCategories] = await Promise.all([
      Lecture.findAll({
        limit: 3,
        include: [{ model: Category, as: "category" }],
        order: [["price", "DESC"]],
        attributes: { exclude: ["UserId", "createdAt", "updatedAt"] }
      }),
      
      Lecture.findAll({
        limit: 6,
        include: [{ model: Category, as: "category" }],
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["UserId", "createdAt", "updatedAt"] }
      }),
      
      Promise.all([
        Lecture.count(),
        Category.count(),
        User.count(),
        Lecture.findOne({
          attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'averagePrice']],
          raw: true
        })
      ]),
      
      Category.findAll({
        limit: 5,
        attributes: ['id', 'name', 'description'],
        order: [["id", "ASC"]]
      })
    ]);
    
    // Format statistics data
    const [lectureCount, categoryCount, userCount, avgPrice] = statistics;
    
    res.status(200).json({
      featuredLectures,
      latestLectures,
      statistics: {
        totalLectures: lectureCount,
        totalCategories: categoryCount,
        totalUsers: userCount,
        averagePrice: avgPrice ? parseFloat(avgPrice.averagePrice).toFixed(2) : 0
      },
      popularCategories
    });
  } catch (err) {
    next(err);
  }
});

// Advanced lecture search with filters, sorting and pagination
router.get("/lectures", async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Search query
    const searchQuery = req.query.search || '';
    
    // Filters
    const filters = {};
    if (req.query.categoryId) {
      filters.CategoryId = req.query.categoryId;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) {
        filters.price[Op.gte] = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filters.price[Op.lte] = parseFloat(req.query.maxPrice);
      }
    }
    
    if (req.query.minExperience) {
      filters.experience_years = {
        [Op.gte]: parseInt(req.query.minExperience)
      };
    }
    
    // Search condition
    if (searchQuery) {
      filters[Op.or] = [
        { name: { [Op.iLike]: `%${searchQuery}%` } },
        { description: { [Op.iLike]: `%${searchQuery}%` } },
        { technique: { [Op.iLike]: `%${searchQuery}%` } }
      ];
    }
    
    // Sorting
    let order = [['id', 'ASC']]; // default sorting
    if (req.query.sortBy) {
      const validColumns = ['id', 'name', 'price', 'createdAt', 'experience_years'];
      const validOrders = ['ASC', 'DESC'];
      
      if (validColumns.includes(req.query.sortBy)) {
        const direction = req.query.sortDirection && 
                         validOrders.includes(req.query.sortDirection.toUpperCase()) ? 
                         req.query.sortDirection.toUpperCase() : 'ASC';
        order = [[req.query.sortBy, direction]];
      }
    }
    
    // Execute query with all parameters
    const { count, rows: lectures } = await Lecture.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: Category, as: "category" }],
      order,
      distinct: true
    });
    
    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      lectures
    });
  } catch (err) {
    next(err);
  }
});

// Get lectures by category with pagination, filters, search
router.get("/categories/:categoryId/lectures", async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    
    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Search query
    const searchQuery = req.query.search || '';
    
    // Filters
    const filters = { CategoryId: categoryId };
    
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price[Op.gte] = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filters.price[Op.lte] = parseFloat(req.query.maxPrice);
    }
    
    // Search condition
    if (searchQuery) {
      filters[Op.and] = [
        { CategoryId: categoryId },
        {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchQuery}%` } },
            { description: { [Op.iLike]: `%${searchQuery}%` } },
            { technique: { [Op.iLike]: `%${searchQuery}%` } }
          ]
        }
      ];
      delete filters.CategoryId; // Remove duplicate condition
    }
    
    // Sorting
    let order = [['id', 'ASC']]; // default sorting
    if (req.query.sortBy) {
      const validColumns = ['id', 'name', 'price', 'createdAt', 'experience_years'];
      const validOrders = ['ASC', 'DESC'];
      
      if (validColumns.includes(req.query.sortBy)) {
        const direction = req.query.sortDirection && 
                         validOrders.includes(req.query.sortDirection.toUpperCase()) ? 
                         req.query.sortDirection.toUpperCase() : 'ASC';
        order = [[req.query.sortBy, direction]];
      }
    }
    
    // Execute query
    const { count, rows: lectures } = await Lecture.findAndCountAll({
      where: filters,
      limit,
      offset,
      order,
      distinct: true
    });
    
    res.status(200).json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description
      },
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      lectures
    });
  } catch (err) {
    next(err);
  }
});

// Get all categories with lecture counts
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: [
        'id', 
        'name', 
        'description',
        [sequelize.fn('COUNT', sequelize.col('Lectures.id')), 'lectureCount']
      ],
      include: [{
        model: Lecture,
        attributes: []
      }],
      group: ['Category.id'],
      order: [['id', 'ASC']]
    });
    
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;