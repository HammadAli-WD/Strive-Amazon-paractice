const mongoose = require("mongoose");
const _ = require("lodash");
const Product = require("./ProductModel")
const schema = new mongoose.Schema(
    {
      total: {
        type: Number,
        default: 0,
      },
      products: [],
      clientId: String,
    },
    { timestamps: true }
  );
  schema.static("add", async function (productId, clientId) {
    const product = await Product.findOne({
      _id: productId,
    });
    let cart = await schema.findOne({ clientId });
    if (cart.products.includes(product)) {
      let exist = cart.products.find((p) => p._id === product._id);
      let id = cart.findIndex(exist);
      exist = { ...exist, quantity: exist.quantity + 1 };
      cart.products[id] = exist;
    } else {
      cart.products = [...cart.products, { ...product, quantity: 1 }];
    }
    await schema.findByIdAndUpdate(cart._id, cart);
  });
  schema.static("delete", async function (productId, clientId) {
    const product = await Product.findOne({
      _id: productId,
    });
    let cart = await schema.findOne({ clientId });
    cart.products = _.without(cart.products, product);
    await schema.findByIdAndUpdate(cart._id, cart);
  });
  module.exports = mongoose.model("Cart", schema);