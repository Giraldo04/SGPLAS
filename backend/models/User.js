// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    shippingAddress: {
      street: { type: String },
      houseNumber: { type: String },
      apartment: { type: String },
      commune: { type: String },
      region: { type: String },
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
