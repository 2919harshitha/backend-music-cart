const express = require("express");

const {
  addProducts,
  allProducts,
  singleProduct,
  filteredProducts,
} = require("../controllers/ProductC");
const router = express.Router();

router.post("/addproduct", addProducts);
router.get("/:id", singleProduct);
router.get("/", allProducts);
router.get("/api/filter", filteredProducts);

module.exports = router;
