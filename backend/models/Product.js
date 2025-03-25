// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'La imagen es obligatoria'],
      default: '/images/sample.jpg',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
