require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const aiRoutes = require('./routes/aiRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (CRUD implementation)
app.use('/api/auth', authRoutes); // Create, Read for users
app.use('/api/posts', postRoutes); // Create, Read, Update, Delete for posts
app.use('/api/ai', aiRoutes); // AI recommendation endpoint

// Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== '!production') {
require ("dotenv").config();
}

// Database Connection and Server Start
const PORT = process.env.PORT || 3000;

sequelize.authenticate().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

module.exports = app;