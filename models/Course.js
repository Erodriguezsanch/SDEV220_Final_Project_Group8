const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;