const Cart = require("../models/Cart");
const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");

router.post("/cart", isAuth, async (req, res) => {
  const {
    productId,
    quantity,
    price,
    title,
    category,
    image,
    description,
    size,
  } = req.body;
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
        products: [
          {
            productId,
            quantity,
            price,
            title,
            category,
            image,
            description,
            size,
          },
        ],
      });
    }

    cart.products.forEach((item) => {
      console.log(item);
      total += item.quantity * item.price;
    });
    cart.total = total;

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
    if (cart) {
      res
        .status(201)
        .send({ message: "suceess to retrieved cart", data: cart });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.delete("/cart", isAuth, async (req, res) => {
  const userId = req.user._id;
  const productId = req.query.productId;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (productId) {
      const productIndex = cart.products.findIndex(
        (item) => item.productId == productId
      );

      if (productIndex > -1) {
        cart.products.splice(productIndex, 1);
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } else {
      cart.products = [];
    }

    cart.total = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    await cart.save();
    res.status(200).json({
      message: productId ? "Product removed from cart" : "Cart emptied",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
