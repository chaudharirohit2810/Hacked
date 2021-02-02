const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Exam = mongoose.model("exams", new Schema({}, { strict: false }));

module.exports = Exam;
