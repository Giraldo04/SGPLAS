// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // <-- Agrega esta línea
const { registerUser, loginUser, updateUserProfile, verifyEmail } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post(
  '/register',
  [
    // Validación del nombre: requerido, mínimo 2 caracteres, etc.
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    // Validación del email: debe ser un email válido
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
    // Validación de la contraseña: mínimo 6 caracteres
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  (req, res, next) => {
    // Manejo de errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  registerUser
);

router.get('/verify', verifyEmail);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
