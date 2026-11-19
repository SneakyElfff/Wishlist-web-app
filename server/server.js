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

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

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
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
})
    .then(() => {
        console.log('[MongoDB] Connected successfully');
    })
    .catch(err => {
        console.error('[MongoDB] Connection failed:', err.message);

        if (err.reason?.servers) {
            for (const [address, server] of err.reason.servers) {
                console.error('[MongoDB] Server details:', {
                    address,
                    type: server.type,
                    error: server.error?.message || 'No detailed error'
                });
            }
        }

        if (err.cause) {
            console.error('[MongoDB] Cause:', err.cause);
        }
    });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
