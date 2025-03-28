const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  street: { type: String, required: true },
  houseNumber: { type: String, required: true },
  apartment: { type: String },
  commune: { type: String, required: true },
  region: { type: String, required: true },
  default: { type: Boolean, default: false }, // Opcional: marca la dirección predeterminada
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    shippingAddresses: [addressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
