const express = require("express");
const requireAuth = require("../middleware/authMiddleware")
const {
  addToCart,
  getCartProducts,
  clearCart,
  updateCart,
  removeFromCart,
  checkoutCart,
} = require("../controllers/CartC");

const router = express.Router();

router.post("/addtocart",requireAuth, addToCart);
router.get("/getcart",requireAuth, getCartProducts);
router.put("/update", updateCart);
router.delete("/:userId/:productId", removeFromCart);
router.post("/clear", clearCart);
router.post("/create-checkout-sesion", checkoutCart);

module.exports = router;
