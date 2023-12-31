const express = require("express");
import requireAuth from "../middleware/authMiddleware.js";
const {
  addToCart,
  fetchCartProducts,
  clearCart,
  updateCart,
  removeFromCart,
  checkoutCart,
} = require("../controllers/CartC");

const router = express.Router();

router.post("/addtocart", addToCart);
router.get("/get_cart",requireAuth, fetchCartProducts);
router.post("/update", updateCart);
router.delete("/:userId/:productId", removeFromCart);
router.post("/clear/:userId", clearCart);
router.post("/create-checkout-sesion", checkoutCart);

module.exports = router;
