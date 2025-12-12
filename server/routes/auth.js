const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Ничего не забыли?' });
    }

    try {
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(401).json({ message: 'Вы кто такие? Я вас не звал'});
        }

        // TODO: later use bcrypt.compare(password, user.password)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Вы точно не мошенники?'});
        }

        res.json({
            message: 'Успешный успех',
            user: { id: user._id, login: user.login }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Технические шоколадки' });
    }
});

module.exports = router;