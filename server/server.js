const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Routes (API должны быть до статических файлов и SPA)
console.log('Loading gift routes...'); // Для отладки
const giftRoutes = require('./routes/gifts');
app.use('/api/gifts', giftRoutes);

// Базовый маршрут API
app.get('/api', (req, res) => {
    res.send('WishList API is running');
});

// Обслуживание статических файлов React
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// Обработка всех остальных GET-запросов для SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));