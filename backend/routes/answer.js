const router = require("express").Router();
const Answer = require("../models/answer");
const Types = require("mongoose").Types;

router.route("/submitAnswers").post(async (req, res) => {
  try {
    const { examID, answers } = req.body;
    const EID = Types.ObjectId(examID);
    const newAnswer = new Answer({
      examID: EID,
      answers,
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
