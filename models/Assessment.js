const mongoose = require("mongoose");


// Assessment Schema
const assessmentSchema = new mongoose.Schema({

    device: {
        type: String,
        required: true
    },

    brand: {
        type: String
    },

    age: {
        type: Number,
        required: true
    },

    condition: {
        type: String,
        required: true
    },

    recommendation: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    scores: {
        repair: Number,
        reuse: Number,
        sell: Number,
        donate: Number,
        recycle: Number
    }

}, {
    timestamps: true
});


// Create Model
const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;