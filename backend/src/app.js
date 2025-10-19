const express = require('express');
const cors = require('cors');
const path = require('path');

// * Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

//* Middlewares essenciais
//? app.use(cors()); // Permite requisições do frontend

//! Defina de onde o frontend fará as requisições
const seuIpDoRadmin = '26.106.165.16'; //! Apenas o ip, sem a porta!
const originPermitida = `http://${seuIpDoRadmin}:8080`;

app.use(express.json()); //* Habilita o parsing de JSON no body

const corsOptions = {
  origin: originPermitida,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

//! Servir arquivos estáticos (MUITO IMPORTANTE para os avatares)
app.use(express.static(path.join(__dirname, '../public')));

//! Definir rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

//* Rota de "Olá, mundo!" para testar
app.get('/', (req, res) => {
  res.send('API do Fit Memory Game v2 está no ar!');
});

module.exports = app;