const router = require("express").Router();
const Exam = require("../models/exam");

router.route("/").get(async (req, res) => {
    try {
        var exams = await Exam.find();
        res.status(200).send(exams);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.route("/").post(async (req, res) => {
    try {
        var exam = new Exam(req.body);
        await exam.save();
        res.status(200).send("Exam saved");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
