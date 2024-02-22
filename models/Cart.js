const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: Number,
        quantity: Number,
        price: Number,
        title: String,
        category: String,
        image: String,
        description: String,
        size: String,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Cart", CartSchema);
