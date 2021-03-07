const router = require("express").Router();
const Exam = require("../models/exam");
const User = require("../models/User");
const Answer = require("../models/answer");
const Types = require("mongoose").Types;
const config = require("config");
const { generate_key, encrypt, decrypt } = require("../util/crypto");
const fast2sms = require("fast-two-sms");

router.route("/sendSMS").post(async (req, res) => {
  try {
    const { KEY } = req.body;
    const users = await User.find();
    const parsedUsers = JSON.parse(JSON.stringify(users));
    const NUMBERS = parsedUsers.map((user, index) => user.contactNumber);
    const SMS_API_KEY = config.get("SMS_API_KEY");
    fast2sms
      .sendMessage({
        authorization: SMS_API_KEY,
        message: `Exam Password: ${KEY}`,
        numbers: NUMBERS,
      })
      .then((response) => {
        // console.log(response);
        res.status(200).send("SMS sent successfully !");
      })
      .catch((error) => {
        console.log(error.message);
        res.status(400).send(error.message);
      });

    // nexmo.message.sendSms(
    //   "NUMBER",
    //   user.contactNumber,
    //   KEY,
    //   { type: "unicode" },
    //   (error, responseData) => {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log(responseData.messages);
    //     }
    //   }
    // );
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

router.route("/getExam/:examID").get(async (req, res) => {
  try {
    const examID = req.params.examID;
    var exam = await Exam.findById(examID);
    exam = JSON.stringify(exam);
    exam = JSON.parse(exam);
    let totalMarks = 0;
    exam.Questions.forEach((element) => {
      totalMarks += parseInt(element["marks"]);
    });

    res.status(200).send({
      exam,
      totalMarks,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

router.route("/").get(async (req, res) => {
  try {
    const collegeID = req.header("collegeID");
    const admin = req.header("isadmin");

    var exams = await Exam.find();
    exams = JSON.stringify(exams);
    exams = JSON.parse(exams);

    var data = await Promise.all(
      exams.map(async (exam) => {
        console.log(exam._id);

        let answer = await Answer.findOne({
          examID: Types.ObjectId(exam._id),
          collegeID,
        });
        console.log(answer);

        const { Questions, key, ...temp } = exam;
        var totalMarks = 0;
        for (var index in Questions) {
          totalMarks += parseInt(Questions[index]["marks"]);
        }
        if (admin === "true") {
          return {
            totalQuestions: Questions.length,
            totalMarks,
            ...temp,
            key,
          };
        }
        return {
          totalQuestions: Questions.length,
          totalMarks,
          ...temp,
          answer: answer ? true : false,
        };
      })
    );
    // console.log(data);
    res.status(200).send(data);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

router.route("/download").get(async (req, res) => {
  try {
    const id = req.header("id");
    let exam = await Exam.findById(id);
    exam = JSON.stringify(exam);
    exam = JSON.parse(exam);
    // console.log(exam);
    if (exam.random) {
      let Questions = shuffle(exam.Questions);
      exam["Questions"] = Questions;
    }
    var data = encrypt(JSON.stringify(exam), exam.key);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.route("/").post(async (req, res) => {
  try {
    const key = generate_key(8);
    const data = { key, ...req.body };
    var exam = new Exam(data);
    await exam.save();
    res.status(200).send({ key });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.route("/review").get(async (req, res) => {
  try {
    const examID = Types.ObjectId(req.header("examID"));
    const collegeID = req.header("collegeID");
    const exam = await Exam.findById(Types.ObjectId(examID));
    const answer = await Answer.findOne({ examID, collegeID });
    res.status(200).send({ answer, exam });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
