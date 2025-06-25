const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    reserved: { type: Boolean, default: false },
    reservedBy: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Gift', giftSchema);