const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
  //* Registrar usuário
  async register(req, res) {
    try {
      const { name, student_id, password, is_ufc_student, email } = req.body;

      //* Validação básica
      if (!name || !student_id || !password) {
        return res.status(400).json({ message: 'Nome, matrícula e senha são obrigatórios.' });
      }

      //* Verifica se a matrícula já está cadastrada
      const existingUser = await userModel.findUserByStudentId(student_id);
      if (existingUser) {
        return res.status(409).json({ message: 'Matrícula já cadastrada.' });
      }

      //! Criar usuário
      const newUser = await userModel.createUser({ name, student_id, password, is_ufc_student, email });

      res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
  },

  //* Efetuar login
  async login(req, res) {
    try {
      const { student_id, password } = req.body;

      //* Encontrar usuário
      const user = await userModel.findUserByStudentId(student_id);
      if (!user) {
        return res.status(401).json({ message: 'Matrícula ou senha inválida.' });
      }

      //* Verifica a senha
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Matrícula ou senha inválida.' });
      }

      //! Gera Token JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      //! Envia o usuário de volta sem a senha
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        is_ufc_student: user.is_ufc_student,
        avatar_url: user.avatar_url
      };

      res.status(200).json({ token, user: userResponse });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao fazer login.' });
    }
  }
};

module.exports = authController;