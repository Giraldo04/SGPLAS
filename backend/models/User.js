const mongoose = require('mongoose');
const Yup = require('yup');

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
    isVerified: { type: Boolean, default: false },
    shippingAddresses: [addressSchema],
  },
  { timestamps: true }
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  email: Yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});

module.exports = mongoose.model('User', userSchema);
module.exports.validationSchema = validationSchema;