require("dotenv").config();

const express = require("express");

const app = express();

const mongoose = require("mongoose");

const encrypt = require("mongoose-encryption");

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully on port 3000.");
});

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    });
  });

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })

  .post(function (req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
