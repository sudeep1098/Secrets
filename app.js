require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

const url = "mongodb://127.0.0.1:27017/userDB";
mongoose
  .connect(url)
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.error(err);
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  user
    .save()
    .then((saveduser) => {
      //   console.log(saveduser);
      res.render("secrets");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username })
    .then((founduser) => {
      if (founduser) {
        if (founduser.password === password) {
          res.render("secrets");
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(3000, function () {
  console.log("Server is running");
});
