const router = require("express").Router();
const Exam = require("../models/exam");
const User = require("../models/User");
const Nexmo = require("nexmo");
const nexmo = new Nexmo(
  {
    apiKey: "1374c521",
    apiSecret: "qYx6GFMz93WKjE6m",
  },
  { debug: true }
);
const { generate_key, encrypt, decrypt } = require("../util/crypto");

// router.route("/sendSMS").post(async (req, res) => {
//   try {
//     const { KEY } = req.body;
//     const users = await User.find();
//     const parsedUsers = JSON.parse(JSON.stringify(users));
//     await parsedUsers.forEach((user, index) => {
//       nexmo.message.sendSms(
//         "919767412232",
//         user.contactNumber,
//         KEY,
//         { type: "unicode" },
//         (error, responseData) => {
//           if (error) {
//             console.log(error);
//           } else {
//             console.log(responseData.messages);
//           }
//         }
//       );
//     });
//     res.status(200).send("SMS sent successfully !");
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).send(error.message);
//   }
// });

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
