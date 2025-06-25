const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift');

// Get all gifts
router.get('/', async (req, res) => {
    try {
        const gifts = await Gift.find();
        res.json(gifts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reserve a gift
router.post('/:id/reserve', async (req, res) => {
    try {
        const gift = await Gift.findById(req.params.id);
        if (!gift) return res.status(404).json({ message: 'Подарок не найден' });
        if (gift.reserved) return res.status(400).json({ message: 'Не успели' });

        gift.reserved = true;
        gift.reservedBy = req.body.reservedBy;
        const updatedGift = await gift.save();
        res.json(updatedGift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Unreserve a gift
router.post('/:id/unreserve', async (req, res) => {
    try {
        const gift = await Gift.findById(req.params.id);
        if (!gift) return res.status(404).json({ message: 'Подарок не найден' });
        if (!gift.reserved) return res.status(400).json({ message: 'Так он свободен' });
        if (gift.reservedBy.toLowerCase() !== req.body.reservedBy.toLowerCase()) {
            return res.status(403).json({ message: 'Хитро, но кто-то оказался быстрее, так что увы' });
        }

        gift.reservedBy = '';
        gift.reserved = false;
        const updatedGift = await gift.save();
        res.json(updatedGift);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;