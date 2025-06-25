const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const giftRoutes = require('./routes/gifts');
app.use('/api/gifts', giftRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('WishList API is running');
});

// Обслуживание статических файлов React
app.use(express.static(path.join(__dirname, '../client/build')));

// Обработка всех остальных маршрутов (для SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));