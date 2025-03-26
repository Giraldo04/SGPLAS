// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'El usuario ya existe' });
      return;
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos del usuario inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Actualiza shippingAddress si se proporciona
      if (req.body.shippingAddress) {
        user.shippingAddress = req.body.shippingAddress;
      }
      // Puedes actualizar otros campos si lo deseas (como name o email)
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        shippingAddress: updatedUser.shippingAddress,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { registerUser, loginUser, updateUserProfile };
