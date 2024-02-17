const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "BhaiBoltei";

// Creating a user using POST  "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }), //This is express validator for fields
    body("email", "Invalid email").isEmail(),
    body("password", "minimun length should be 5 !").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // If there are errors then it will return bad request and the errors also
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }

    try {
      // Check whether the user with the entered email already exits
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email already exists !" });
      }

      // Generating salt
      const salt = await bcrypt.genSalt(10);
      // Hashing the password using the user password and salt
      const secpassword = await bcrypt.hash(req.body.password, salt);

      // Create a user
      user = await User.create({
        name: req.body.name,
        password: secpassword,
        email: req.body.email,
      });

      // data nedd to send as response
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET); // it is a synchronous method so no need of await it takes data and the secret mesage as argument

      res.json({ authtoken }); // sending response
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal error has occured ");
    }
  }
);

// For user login

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }
    const { email, password } = req.body; // Destructuring  the email and password from the req,body
    try {
      let user = User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials!!" });
      }

      const compare_password = bcrypt.compare(password, user.password); // comparing the user entered pass with the pass in db
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET); // it is a synchronous method so no need of await it takes data and the secret mesage as argument

      res.json({ authtoken }); // sending response
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal error has occured ");
    }
  }
);

module.exports = router;
