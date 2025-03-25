// backend/routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/adminUserController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Solo administradores pueden acceder a estas rutas
router.get('/', protect, admin, getUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
