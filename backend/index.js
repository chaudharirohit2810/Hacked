const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDatabase = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const routes = ["user"];

const app = express();

(async function () {
  await connectDatabase();
})();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

routes.forEach((route) => {
  app.use(`/api/${route}`, require(`./routes/${route}`));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
