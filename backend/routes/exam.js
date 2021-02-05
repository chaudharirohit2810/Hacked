const router = require("express").Router();
const Exam = require("../models/exam");
const User = require("../models/User");
const config = require("config");
const { generate_key, encrypt, decrypt } = require("../util/crypto");
const fast2sms = require("fast-two-sms");
// const Nexmo = require("nexmo");
// const nexmo = new Nexmo(
//   {
//     apiKey: "",
//     apiSecret: "",
//   },
//   { debug: true }
// );

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

router.route("/").get(async (req, res) => {
  try {
    const admin = req.header("isadmin");
    // console.log(admin);
    var exams = await Exam.find();
    exams = JSON.stringify(exams);
    exams = JSON.parse(exams);

    var data = exams.map((exam) => {
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
    let exam = await Exam.findById(id);
    exam = JSON.stringify(exam);
    exam = JSON.parse(exam);
    var data = encrypt(JSON.stringify(exam), exam.key);
    // console.log(data);
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

module.exports = router;
