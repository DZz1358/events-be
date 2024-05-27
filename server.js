require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth-routes');

const eventRoutes = require('./routes/events-routes');

const bodyParser = require('body-parser');

const port = 3000;
// const port = process.env.PORT || 3000;
const db = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('Connected to DB', db))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(eventRoutes)

app.use((req, res) => {
  res
    .status(500)
    .send('<h1>Мимо Брат,мимо</h1>')
})

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

