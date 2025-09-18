const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  productImage: {
    imageUrl: { type: String },
    publicId: { type: String }
  }
}, { timestamps: true });

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;