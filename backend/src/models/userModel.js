const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const userModel = {
  //* Criar um novo usuário
  async createUser(user) {
    const { name, student_id, password, is_ufc_student, email } = user;
    
    //* Hash da senha
    const password_hash = await bcrypt.hash(password, 10);
    
    //* Avatar padrão
    const defaultAvatar = '___.jpeg'; 

    const sql = `INSERT INTO users (name, student_id, password_hash, is_ufc_student, email, avatar_url)
                VALUES (?, ?, ?, ?, ?, ?)`;
    
    // * 'email' pode ser nulo se não for fornecido no cadastro
    const [result] = await pool.query(sql, [name, student_id, password_hash, is_ufc_student, email || null, defaultAvatar]);
    
    return { id: result.insertId, ...user };
  },

  //* Encontrar usuário pela matrícula
  async findUserByStudentId(student_id) {
    const sql = `SELECT * FROM users WHERE student_id = ?`;
    const [rows] = await pool.query(sql, [student_id]);
    return rows[0];
  },

  //* Encontrar usuário pelo ID
  async findUserById(id) {
    const sql = `SELECT id, name, email, student_id, is_ufc_student, avatar_url, score 
                FROM users WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  },
  // TODO: Atualizar perfil
  async updateUser(id, userData) {
    const { name, email, password } = userData;
    let sql = 'UPDATE users SET name = ?, email = ?';
    const params = [name, email, id];

    //! Se uma nova senha foi fornecida, atualiza o hash
    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      sql += ', password_hash = ?';
      params.splice(2, 0, password_hash); //!Insere o hash na posição correta
    }

    sql += ' WHERE id = ?';
    
    await pool.query(sql, params);
    return this.findUserById(id);
  },

  //* Atualizar apenas o avatar
  async updateAvatar(id, avatar_url) {
    const sql = `UPDATE users SET avatar_url = ? WHERE id = ?`;
    await pool.query(sql, [avatar_url, id]);
    return this.findUserById(id);
  }
};



module.exports = userModel;