const router = require("express").Router();
const Exam = require("../models/exam");

router.route("/").get(async (req, res) => {
    try {
        var exams = await Exam.find();
        exams = JSON.stringify(exams);
        exams = JSON.parse(exams);

        var data = exams.map((exam) => {
            const { Questions, ...temp } = exam;
            var totalMarks = 0;
            for (var index in Questions) {
                totalMarks += parseInt(Questions[index]["marks"]);
            }
            return {
                totalQuestions: Questions.length,
                totalMarks,
                ...temp,
            };
        });

        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

router.route("/download").get(async (req, res) => {
    try {
        const id = req.header("id");
        const exam = await Exam.findById(id);
        res.status(200).send(exam);
    } catch (error) {
        res.status(400).send(error.message);
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
