const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
};

const register = async (req, res) => {
  try {
    const { name, password, email, mobile } = req.body;

    if (!name || !password || !email || !mobile) {
      return res
        .status(400)
        .json({ message: "please fill above details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "This email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      cart: [],
    });

    const token = jwt.sign(
      { 
        email, 
        password: hashedPassword
       },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

     res.json({
      name: user.name,
      success: true,
      userId: user._id,
      message: "User created",
      token: token,
      cart: user.cart,
    });

  } catch (error) {
   errorHandler(res,error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: " Please enter valid email " });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid  password" });
    }

    const token = jwt.sign({ email },
      process.env.JWT_SECRET, 
      {expiresIn: "3h"},
    );

    res.json({
      name: user.name,
      success: true,
      userId: user._id,
      message: "User logged in",
      token: token,
      cart: user.cart,
    });

  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = { register, login };
