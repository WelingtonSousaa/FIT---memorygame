const userModel = require('../models/userModel');
const fs = require('fs');
const path = require('path');

const userController = {
  //* Buscar dados do usuário logado
  async getMe(req, res) {
    try {
      const user = await userModel.findUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
    }
  },

  //* Atualizar perfil (Nome, Email, Senha)
  async updateProfile(req, res) {
    try {
      const { name, email, password } = req.body;
      const updatedUser = await userModel.updateUser(req.user.userId, { name, email, password });
      res.status(200).json({ message: 'Perfil atualizado com sucesso!', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar perfil.' });
    }
  },

  //* Atualizar avatar
  async uploadAvatar(req, res) {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    try {
      const userId = req.user.userId;
      const newAvatarFilename = req.file.filename;

      //* 1. Buscar usuário para pegar o nome do avatar antigo
      const user = await userModel.findUserById(userId);
      const oldAvatar = user.avatar_url;

      //* 2. Deletar o avatar antigo, se não for o padrão
      if (oldAvatar && oldAvatar !== '___.jpeg') {
        const oldAvatarPath = path.join(__dirname, '../../public/avatares', oldAvatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      //! 3. Atualizar o banco de dados com o novo nome
      const updatedUser = await userModel.updateAvatar(userId, newAvatarFilename);

      res.status(200).json({ 
        message: 'Avatar atualizado com sucesso!', 
        avatar_url: newAvatarFilename, // Retorna o nome do novo arquivo
        user: updatedUser 
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar avatar.' });
    }
  }
};

module.exports = userController;