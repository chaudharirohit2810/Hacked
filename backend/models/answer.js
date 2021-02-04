const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Answer = mongoose.model("answers", new Schema({}, { strict: false }));

module.exports = Answer;
