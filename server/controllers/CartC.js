const User = require("../Models/User.js");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIP_SECRECT_KEY);

const addToCart = async (req, res) => {
  try {
    const { userId, product, quantity = 1 } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item._id.toString() === product._id
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push(product);
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

const fetchCartProducts = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userID;

    const user = await User.findById(userId).populate('cart.product');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cartDetails = user.cart.map(item => {
      const { _id, name, price, company, colour, type, about_item, images, featured } = item.product;
      return {
        _id: item._id,
        product: {
          _id,
          name,
          price,
          company,
          colour,
          type,
          about_item,
          images,
          featured
        },
        quantity: item.quantity
      };
    });

    res.status(200).json( cartDetails);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item._id.toString() === productId
    );
    if (!cartItem) {
      return res.status(400).json({ message: "Product not in cart" });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.cart = user.cart.filter((item) => item._id.toString() !== productId);
    await user.save();

    res
      .status(200)
      .json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];

    await user.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const { cartItems, totalAmount, cartTotalAmount } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems?.map((item) => ({
        price_data: {
          currency: ".rs",
          product_data: {
            name: item.title,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_PORT}/order-success`,
      cancel_url: `${process.env.CLIENT_PORT}/checkout`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addToCart,
  fetchCartProducts,
  updateCart,
  removeFromCart,
  clearCart,
  checkoutCart,
};
