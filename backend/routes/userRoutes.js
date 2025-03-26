// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController');
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
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
