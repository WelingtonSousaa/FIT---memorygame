const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

//* Rota para buscar dados do usuário logado (usado no header)
router.get('/me', authenticateToken, userController.getMe);

//* Rota para atualizar o perfil (Nome, Email, Senha)
router.put('/profile', authenticateToken, userController.updateProfile);

//* Rota para upload de avatar
//! Usa o middleware de auth e depois o de upload
router.post('/avatar', authenticateToken, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;