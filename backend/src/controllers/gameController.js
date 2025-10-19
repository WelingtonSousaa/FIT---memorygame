const gameModel = require('../models/gameModel');

const gameController = {
  //* Rota para o frontend pegar as cartas dinamicamente
  async getCards(req, res) {
    try {
      //! O frontend usa 12 cartas
      const cards = await gameModel.getCards();
      res.status(200).json(cards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar cartas.' });
    }
  },

  //* Salvar uma partida
  async saveGame(req, res) {
    try {
      const userId = req.user.userId;
      const { score, time, difficulty } = req.body;

      if (score === undefined || time === undefined || !difficulty) {
        return res.status(400).json({ message: 'Dados da partida incompletos.' });
      }

      await gameModel.saveGameResult({ userId, score, time, difficulty });
      res.status(201).json({ message: 'Partida salva com sucesso!' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao salvar partida.' });
    }
  },

  //* Buscar o histórico do usuário logado
  async getHistory(req, res) {
    try {
      const userId = req.user.userId;
      const history = await gameModel.getUserHistory(userId);
      res.status(200).json(history);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar histórico.' });
    }
  },

  //* Buscar o ranking geral
  async getRanking(req, res) {
    try {
      const { difficulty } = req.query; // Ex: ranking?difficulty=intermediario
      if (!difficulty) {
        return res.status(400).json({ message: 'Dificuldade é obrigatória.' });
      }
      
      const ranking = await gameModel.getRanking(difficulty);
      res.status(200).json(ranking);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar ranking.' });
    }
  }
};

module.exports = gameController;