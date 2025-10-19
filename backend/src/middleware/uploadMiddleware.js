const multer = require('multer');
const path = require('path');
const fs = require('fs');

//* Define o local de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/avatares');
    //* Cria o diretório se não existir
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    //* Cria um nome de arquivo único para evitar conflitos (ex: user-1-1678886400000.jpeg)
    const uniqueName = `user-${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

//* Filtro de arquivo (apenas imagens)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } //! Limite de 5MB
});

module.exports = upload;