// backend/controllers/adminUserController.js
const mongoose = require('mongoose');
const User = require('../models/User');

// Obtener la lista de todos los usuarios (sin la contraseña)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Actualizar usuario (nombre, email, rol)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Convertir isAdmin a Boolean si se envía en formato string
      user.isAdmin =
        req.body.isAdmin !== undefined ? Boolean(req.body.isAdmin) : user.isAdmin;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  console.log('deleteUser llamado con ID:', req.params.id);

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const user = await User.findById(req.params.id);
    console.log('Usuario encontrado:', user);

    if (user) {
      // Opción A: Eliminar usando el método "deleteOne()" del documento
      await user.deleteOne(); 
      // O también podrías usar el modelo:
      // await User.deleteOne({ _id: user._id });

      return res.json({ message: 'Usuario eliminado' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
