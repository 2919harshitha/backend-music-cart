const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  title: String,
  brand: String,
  description: String,
  price: Number,
  images: [String],
  stock: Number,
  type: String,
  color: String,
  details: [String],
  quantity: {
    type: Number,
    default: 1,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [cartItemSchema],
});

module.exports = mongoose.model("User", userSchema);


