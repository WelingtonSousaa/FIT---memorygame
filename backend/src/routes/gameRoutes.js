const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authenticateToken = require('../middleware/authMiddleware');

//* Todas as rotas de jogo são protegidas
router.use(authenticateToken);

//* Buscar a lista de cartas
router.get('/cards', gameController.getCards);

//* Salvar o resultado de uma partida
router.post('/save', gameController.saveGame);

//* Buscar o histórico de partidas do usuário
router.get('/history', gameController.getHistory);

//* Buscar o ranking geral
router.get('/ranking', gameController.getRanking);

module.exports = router;