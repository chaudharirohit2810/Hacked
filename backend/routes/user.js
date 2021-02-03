const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

async function compareHashedPassword(password, dbpassword) {
  try {
    const compared = await bcrypt.compare(password, dbpassword);
    return compared;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function returnHashedPassowrd(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error.message);
    return password;
  }
}

router.route("/login").post(async (req, res) => {
  try {
    const { collegeID, password } = req.body;
    const user = await User.findOne({ collegeID });
    if (user) {
      const parsedUser = JSON.parse(JSON.stringify(user));
      compareHashedPassword(password, parsedUser.password)
        .then((result) => {
          if (result) {
            res.status(200).json({
              result: parsedUser,
              error: false,
            });
          } else
            res.status(403).json({
              result: "Invalid password !",
              error: true,
            });
        })
        .catch((error) => console.log(error.message));
    } else {
      res.status(403).json({
        result: "Student is not registered !",
        error: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Student Login Failed !",
      error: true,
    });
  }
});

router.route("/register").post(async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      collegeID,
      collegeName,
      contactNumber,
      password,
      images,
    } = req.body;
    const user = await User.findOne({ collegeID });
    if (user) {
      res.status(409).send({
        result: "Student Already Exists !",
        error: true,
      });
    } else {
      returnHashedPassowrd(password)
        .then((hashPassord) => {
          const newUser = new User({
            firstName,
            lastName,
            collegeID,
            contactNumber,
            collegeName,
            images,
            password: hashPassord,
          });
          newUser
            .save()
            .then((usr) => res.json(usr))
            .catch((error) => console.log(error.message));
        })
        .catch((error) => console.log(error.message));
      res.status(200).json({
        result: "Student Registeration Successful !",
        error: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "Student Registeration Failed !",
      error: true,
    });
  }
});

router.route("/").get(async (req, res) => {
  try {
    res.status(200).send("Hello !");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
