const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Usuário e senha são obrigatórios!' });
    }

    const querySelect = 'SELECT * FROM users WHERE username = ?';
    db.query(querySelect, [username], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Erro ao acessar o banco de dados.' });
        }

        const currentDate = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

        if (results.length > 0 && results[0].password === password) {
            const queryUpdate = 'UPDATE users SET last_acess_date = ? WHERE id = ?';
            db.query(queryUpdate, [currentDate, results[0].id], (err) => {
                if (err) {
                    return res.status(500).send({ message: 'Erro ao atualizar a data de último acesso.' });
                }
                return res.status(200).send({ message: 'Login efetuado com sucesso!' });
            });
        } else if (results.length > 0) {
            return res.status(401).send({ message: 'Senha incorreta!' });
        } else {
            const queryInsert = 'INSERT INTO users (username, password, last_acess_date) VALUES (?, ?, ?)';
            db.query(queryInsert, [username, password, currentDate], (err) => {
                if (err) {
                    return res.status(500).send({ message: 'Erro ao criar usuário.' });
                }
                return res.status(201).send({ message: 'Usuário criado e login efetuado com sucesso!' });
            });
        }
    });
});

app.post('/update-best-time', (req, res) => {
    const { username, bestTime } = req.body;

    if (!username || !bestTime) {
        return res.status(400).send({ message: 'Parâmetros inválidos.' });
    }

    const querySelect = 'SELECT best_time FROM users WHERE username = ?';
    db.query(querySelect, [username], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Erro ao buscar o melhor tempo.' });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'Usuário não encontrado.' });
        }

        const currentBestTime = results[0].best_time;
        console.log('Tempo retornado do banco (antes da comparação):', currentBestTime, 'Tipo:', typeof currentBestTime);

        try {
            const currentBestSeconds = convertToSeconds(currentBestTime);
            const newBestSeconds = convertToSeconds(bestTime);

            if (newBestSeconds < currentBestSeconds) {
                const queryUpdate = 'UPDATE users SET best_time = ? WHERE username = ?';
                db.query(queryUpdate, [bestTime, username], (err) => {
                    if (err) {
                        return res.status(500).send({ message: 'Erro ao atualizar o melhor tempo.' });
                    }
                    return res.status(200).send({ message: 'Melhor tempo atualizado com sucesso!' });
                });
            } else {
                return res.status(200).send({ message: 'O tempo enviado não é menor que o melhor tempo atual.' });
            }
        } catch (error) {
            console.error('Erro ao converter o tempo:', error.message);
            return res.status(500).send({ message: 'Erro ao processar os tempos.' });
        }
    });
});

const convertToSeconds = (time) => {
    console.log('Valor recebido em convertToSeconds:', time, 'Tipo:', typeof time);

    if (!time) {
        return Infinity;
    }

    if (typeof time === 'number') {
        return time;
    }

    if (typeof time === 'string') {
        const parts = time.split(':');
        if (parts.length === 3) {
            const [hours, minutes, seconds] = parts.map(Number);
            return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
        } else {
            console.error('Formato inválido detectado em convertToSeconds:', time);
            throw new Error('Formato inválido de tempo!');
        }
    }

    throw new Error('Formato de tempo inesperado!');
};

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
