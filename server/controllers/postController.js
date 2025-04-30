const { Post, User } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ include: [{ model: User, as: 'driver' }] });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menambahkan method untuk mendapatkan post berdasarkan ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({
      where: { id },
      include: [{ model: User, as: 'driver' }]
    });
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  const { truckType, maxWeight, origin, destination, availableDate, availableTime, shippingCost } = req.body;
  try {
    const post = await Post.create({
      driverId: req.user.id,
      truckType,
      maxWeight,
      origin,
      destination,
      availableDate,
      availableTime,
      shippingCost
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { truckType, maxWeight, origin, destination, availableDate, availableTime, shippingCost } = req.body;
  try {
    const post = await Post.findOne({ where: { id, driverId: req.user.id } });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.update({ truckType, maxWeight, origin, destination, availableDate, availableTime, shippingCost });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ where: { id, driverId: req.user.id } });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchPosts = async (req, res) => {
  const { search, truckType, sortBy, order, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  let where = {};
  if (search) {
    where = { [Op.or]: [{ origin: { [Op.iLike]: `%${search}%` } }, { destination: { [Op.iLike]: `%${search}%` } }] };
  }
  if (truckType) {
    where.truckType = truckType;
  }
  try {
    const posts = await Post.findAndCountAll({
      where,
      order: [[sortBy || 'createdAt', order || 'DESC']],
      limit,
      offset,
      include: [{ model: User, as: 'driver' }]
    });
    res.json({ posts: posts.rows, total: posts.count, pages: Math.ceil(posts.count / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProvinces = async (req, res) => {
  try {
    const response = await axios.get('https://api.rajaongkir.com/starter/province', {
      headers: { key: process.env.RAJAONGKIR_API_KEY }
    });
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCities = async (req, res) => {
  try {
    const response = await axios.get('https://api.rajaongkir.com/starter/city', {
      headers: { key: process.env.RAJAONGKIR_API_KEY }
    });
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShippingCost = async (req, res) => {
  const { origin, destination, weight, courier } = req.body;
  try {
    const response = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      { origin, destination, weight, courier },
      { headers: { key: process.env.RAJAONGKIR_API_KEY } }
    );
    res.json(response.data.rajaongkir.results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  searchPosts, 
  getProvinces, 
  getCities, 
  getShippingCost 
};