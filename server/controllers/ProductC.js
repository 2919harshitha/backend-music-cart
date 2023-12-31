const Product = require("../Models/Product");

const addProducts = async (req, res) => {
  const {
    title,
    brand,
    description,
    price,
    images,
    stock,
    type,
    color,
    details,
  } = req.body;

  if (
    !title ||
    !brand ||
    !description ||
    !price ||
    !stock ||
    !type ||
    !color ||
    !details
  ) {
    return res.status(502).json({ message: "please fill above fields" });
  }

  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const allProducts = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const filteredProducts = async (req, res) => {
  const { keyword, type, brand, color, priceRange, sortBy, order } = req.query;

  const filter = {};

  if (keyword) {
    filter.title = { $regex: new RegExp(keyword, "i") };
  }
  if (type) {
    filter.type = type;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (color) {
    filter.color = color;
  }

  if (priceRange) {
    const priceRanges = {
      "0-500": { $gte: 0, $lte: 500 },
      "500-1000": { $gte: 500, $lte: 1000 },
      "1000-5000": { $gte: 1000, $lte: 5000 },
      "5000-10000": { $gte: 5000, $lte: 10000 },
    };

    filter.price = priceRanges[priceRange];
  }

  const sortQuery = sortBy ? { [sortBy]: order === "desc" ? -1 : 1 } : {};
  try {
    const product = await Product.find(filter).sort(sortQuery);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const singleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const singleProduct = await Product.findById(productId);
    res.status(200).json(singleProduct);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addProducts,
  allProducts,
  singleProduct,
  filteredProducts,
};
