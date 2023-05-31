var express = require('express');
var adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

var router = express.Router();

// Renderizar a página de registro de administrador
router.get('/register', function (req, res) {
  res.render('register-admin');
});

// Criar Admin
router.post('/createAdmin', authController.verifyAdmin, adminController.create);

// Mostrar todos os usuários
router.get('/users', authController.verifyAdmin, adminController.showUsers);

// Mostrar usuário por ID
router.get('/users/:id', authController.verifyAdmin, adminController.showUser);

// Atualizar usuário
// Renderizar a página de edição de usuário
router.get('/users/edit/:id', authController.verifyAdmin, adminController.editUser);
// Atualizar usuário
router.post('/users/update/:id', authController.verifyAdmin, adminController.updateUser);

// Deletar usuário
router.delete('/users/:id', authController.verifyAdmin, adminController.deleteUser);




module.exports = router;
