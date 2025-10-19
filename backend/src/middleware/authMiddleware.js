const jwt = require('jsonwebtoken');
require('dotenv').config();

//* Middleware para verificar o token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Não autorizado
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Token inválido/expirado
    }
    
    // ! Adiciona o payload do usuário (que contém o userId) ao request
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;