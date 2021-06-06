const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  price: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
});

exports.Product = mongoose.model("Product", productSchema);
