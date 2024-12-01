const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'memory_game',
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o servidor Mysql:', err.message);
        return;
    }
    console.log('Conectado ao servidor Mysql.');

    db.changeUser({ database: 'memory_game' }, (err) => {
        if (err) {
            console.error('Erro ao conectar com o banco de dados:', err.message);
            return;
        }
        console.log('Conectado ao banco de dados mysql');
    })
})

module.exports = db;
