// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Función para generar token de verificación (válido 1 día)
const generateVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Función para enviar el correo de verificación
const sendVerificationEmail = async (user, token) => {
  // Configurar el transportador con Nodemailer
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Ej: smtp.gmail.com
    port: Number(process.env.EMAIL_PORT), // Ej: 587
    secure: Number(process.env.EMAIL_PORT) === 465, // false para 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // URL de verificación (puede redirigir al frontend)
  const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  
  let mailOptions = {
    from: `"Tu E-commerce" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <p>Hola ${user.name},</p>
      <p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu correo:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>El enlace expira en 24 horas.</p>
    `,
  };

  let info = await transporter.sendMail(mailOptions);
  console.log('Correo de verificación enviado, ID:', info.messageId);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario con isVerified false por defecto
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false, // Por defecto no verificado
    });

    if (user) {
      // Generar token de verificación

      const verificationToken = generateVerificationToken(user._id);
      // Enviar correo de verificación
      console.log("Enviando correo de verificación...");
      await sendVerificationEmail(user, verificationToken);
      console.log("Correo de verificación enviado");

      // Responder (puedes optar por no loguear al usuario automáticamente)
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Datos del usuario inválidos' });
    }
  } catch (error) {
    console.error("Error en registerUser:", error);
    return res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("Token generado:", token)

      
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        
      });
      
    } else {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // Actualiza datos básicos
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // Actualiza el array de direcciones de envío, si se proporciona
      if (req.body.shippingAddresses) {
        user.shippingAddresses = req.body.shippingAddresses;
      }
      const updatedUser = await user.save();
      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        shippingAddresses: updatedUser.shippingAddresses,
        isVerified: updatedUser.isVerified,
        token: generateToken(updatedUser._id),
      });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ message: 'Token de verificación no proporcionado' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Redirige al frontend a la página de login o a una confirmación
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error("Error en verifyEmail:", error);
    return res.status(500).json({ message: 'Error en la verificación de email' });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile, verifyEmail };
