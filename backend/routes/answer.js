const router = require("express").Router();
const Answer = require("../models/answer");
const Types = require("mongoose").Types;

router.route("/getAnswers/:examID").get(async (req, res) => {
    try {
        const examID = Types.ObjectId(req.params.examID);
        const examAnswers = await Answer.find({
            examID,
        });
        res.status(200).json(examAnswers);
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
});

router.route("/submitAnswers").post(async (req, res) => {
    try {
        const {
            examID,
            answers,
            collegeID,
            tabSwitched,
            faceWarnings,
        } = req.body;
        const EID = Types.ObjectId(examID);
        const newAnswer = new Answer({
            examID: EID,
            answers,
            collegeID,
            tabSwitched,
            faceWarnings,
        });
        // console.log(newAnswer);
        newAnswer
            .save()
            .then((ans) => res.json(res))
            .catch((error) => console.log(error.message));
        res.status(200).json("Answers Submitted Successfully !");
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
});

module.exports = router;
