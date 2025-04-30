const { Op } = require('sequelize');
const { Post } = require('../models');
const { uploadImage } = require('../helpers/cloudinary');

const createPost = async (req, res, next) => {
  try {
    const { departureDate, origin, destination, truckType, maxWeight, phoneNumber } = req.body;
    
    let imageUrl;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const post = await Post.create({
      departureDate,
      origin,
      destination,
      truckType,
      maxWeight,
      phoneNumber,
      imageUrl,
      driverId: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, truckType, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { origin: { [Op.iLike]: `%${search}%` } },
        { destination: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (truckType) {
      where.truckType = truckType;
    }

    const posts = await Post.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      include: [{ model: require('../models').User, attributes: ['name'] }],
    });

    res.json({
      posts: posts.rows,
      totalPages: Math.ceil(posts.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    next(error);
  }
};

const getDriverPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { driverId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id, driverId: req.user.id } });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let imageUrl = post.imageUrl;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    await post.update({ ...req.body, imageUrl });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id, driverId: req.user.id } });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getPosts, getDriverPosts, updatePost, deletePost };