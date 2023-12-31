const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  brand: String,
  description: String,
  price: Number,
  images: [String],
  stock: Number,
  type: String,
  color: String,
  details: [String],
});

module.exports = mongoose.model("Product", productSchema);

