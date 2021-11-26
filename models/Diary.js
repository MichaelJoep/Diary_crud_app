const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})
// create a model with a name Diary for the diarySchema
module.exports = mongoose.model('Diary', diarySchema);