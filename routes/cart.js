const Cart = require("../models/Cart");
const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");

router.post("/cart", isAuth, async (req, res) => {
  const { productId, quantity, price } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ userId });
    let total = 0;

    if (cart) {
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity, price });
      }
    } else {
      cart = new Cart({
        userId,
        products: [{ productId, quantity, price }],
      });
    }

    cart.products.forEach((item) => {
      console.log(item);
      total += item.quantity * item.price;
    });

    await cart.save();
    res.status(201).json({ cart, total });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.get("/cart", isAuth, async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  try {
    let cart = await Cart.findOne({ userId });
    if (cart && cart.products.length > 0) {
      res
        .status(201)
        .send({ message: "suceess to retrieved cart", data: cart });
    } else {
      res.send(null);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
module.exports = router;
