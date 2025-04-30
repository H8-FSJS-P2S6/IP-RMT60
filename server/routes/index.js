const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);

router.get('/posts', postController.getPosts);
router.get('/posts/:id', postController.getPostById); // Menambahkan endpoint untuk mendapatkan post berdasarkan ID
router.post('/posts', authMiddleware, roleMiddleware('driver'), postController.createPost);
router.put('/posts/:id', authMiddleware, roleMiddleware('driver'), postController.updatePost);
router.delete('/posts/:id', authMiddleware, roleMiddleware('driver'), postController.deletePost);

router.get('/search-posts', postController.searchPosts);

router.get('/provinces', postController.getProvinces);
router.get('/cities', postController.getCities);
router.post('/cost', postController.getShippingCost);

module.exports = router;