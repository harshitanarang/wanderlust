const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema correctly

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now() // Pass function reference, not call
    }
});

module.exports = mongoose.model('Review', reviewSchema);
