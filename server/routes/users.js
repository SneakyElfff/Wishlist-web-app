const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// // Create a user
// router.post('/', async (req, res) => {
//     const { login, password, role } = req.body;
//
//     if (!login || !password) {
//         return res.status(400).json({ message: 'Логин и пароль обязательны' });
//     }
//
//     try {
//         const existing = await User.findOne({ login });
//         if (existing) {
//             return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
//         }
//
//         const hashed = await bcrypt.hash(password, 10);
//         const user = new User({ login, password: hashed, role: role || 'user' });
//         await user.save();
//
//         res.status(201).json({ message: 'Пользователь создан', user: { login: user.login, role: user.role } });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });
//
// // Edit a user
// // TODO: use patch instead of put
// router.put('/:id', async (req, res) => {
//     const { login, password, role } = req.body;
//
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ message: 'Пользователь не найден' });
//         }
//
//         if (login && login != user.login) {
//             const conflict = await User.findOne({ login });
//             if (conflict) {
//                 return res.status(400).json({ message: 'Логин занят' });
//             }
//             user.login = login;
//         }
//
//         if (password) {
//             user.password = await bcrypt.hash(password, 10);
//         }
//
//         if (role) user.role = role;
//
//         await user.save();
//         res.json({ message: 'Пользователь успешно обновлен', user: { login: user.login, role: user.role } });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// })
//
// // Delete a user
// router.delete('/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//
//         if (!user) {
//             return res.status(404).json({ message: 'Пользователь не найден' });
//         }
//
//         res.json({ message: 'Пользователь успешно удален'});
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// })

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;