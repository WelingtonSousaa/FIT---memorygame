const pool = require('../config/db');

const gameModel = {
  //* Buscar todas as cartas
  async getCards() {
    const sql = `SELECT * FROM cards`;
    const [rows] = await pool.query(sql);
    return rows;
  },

  //* Salvar resultado da partida
  async saveGameResult(data) {
    const { userId, score, time, difficulty } = data;
    const sql = `INSERT INTO game_history (user_id, score, time, difficulty) 
                  VALUES (?, ?, ?, ?)`;
    await pool.query(sql, [userId, score, time, difficulty]);
  },

  //* Buscar histórico do usuário (ordenado por melhor tempo)
  async getUserHistory(userId) {
    const sql = `SELECT score, time, difficulty, played_at 
                  FROM game_history 
                  WHERE user_id = ? 
                  ORDER BY time ASC`;
    const [rows] = await pool.query(sql, [userId]);
    return rows;
  },

  //* Buscar ranking (Top 10 por pontuação)
  async getRanking(difficulty) {
    const sql = `
      SELECT u.name, u.avatar_url, MAX(gh.score) as max_score
      FROM game_history gh
      JOIN users u ON gh.user_id = u.id
      WHERE gh.difficulty = ?
      GROUP BY u.id, u.name, u.avatar_url
      ORDER BY max_score DESC
      LIMIT 10
    `;
    const [rows] = await pool.query(sql, [difficulty]);
    return rows;
  }
};

module.exports = gameModel;