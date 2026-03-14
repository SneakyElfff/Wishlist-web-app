const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// TODO: check req.user.role from JWT middleware
const isAdmin = (req, res, next) => {
    next();
};

router.use(isAdmin); // apply to all routes below

// GET all users (no password!)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// POST create user
router.post('/', async (req, res) => {
    try {
        const { login, password, role } = req.body;
        if (!login || !password) {
            return res.status(400).json({ message: 'Логин и пароль обязательны' });
        }

        const existing = await User.findOne({ login });
        if (existing) {
            return res.status(400).json({ message: 'Логин уже занят' });
        }

        const user = new User({ login, password, role: role || 'user' });
        await user.save();

        res.status(201).json({
            message: 'Пользователь создан',
            user: { id: user._id, login: user.login, role: user.role }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const { login, password, role } = req.body;
        const updatedData = { login, role };

        if (password) {
            updatedData.password = await bcrypt.hash(password, 12);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' });

        res.json({ message: 'Пользователь обновлен', user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Пользователь с таким логином уже существует' });
        }
        res.status(400).json({ message: err.message });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' });

        // TODO: prevent deleting yourself or last admin
        res.json({ message: 'Пользователь удален' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления' });
    }
});

module.exports = router;