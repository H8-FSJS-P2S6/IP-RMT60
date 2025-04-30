const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const routes = require('./routes/index');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml'); 

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

// Jika bukan dalam mode testing, jalankan server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export aplikasi untuk keperluan testing
module.exports = app;