const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    cakeName: {
        type: Number,
        required: true
    },
    imagePath: {
        type: Number,
        required: true
    },
    ModelPath: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cake', CakeSchema); 