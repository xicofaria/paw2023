var User = require('../models/user');
var bcrypt = require("bcrypt");

var adminController = {};

// Criar User
adminController.create = async function (req, res) {
  try {
    // Cria um novo utilizador com base nos dados do corpo da requisição
    const user = new User(req.body);
    // Hash da senha do usuário
    user.password = bcrypt.hashSync(req.body.password, 8);

    // Verifica se o utilizador já existe pelo e-mail
    const existingUser = await User.findOne({ email: req.body.email });

    // Se o utilizador não existir e a permissão for 2, salve o novo usuário
    if (existingUser === null) {
      if (req.body.permission == 2) {
        await user.save();
        res.json(req.body);
      }
    } else {
      console.log("User Already Exist");
      res.json({});
    }
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

// Criar Admin
adminController.createAdmin = async function (req, res) {
  try {
    // Cria um novo administrador com base nos dados do corpo da requisição
    const admin = new Admin(req.body);
    // Hash da senha do administrador
    admin.password = bcrypt.hashSync(req.body.password, 8);

    // Verifica se o administrador já existe pelo e-mail
    const existingAdmin = await Admin.findOne({ email: req.body.email });

    // Se o administrador não existir e a permissão for 1, salve o novo administrador
    if (existingAdmin === null) {
      if (req.body.permission == 1) {
        await admin.save();
        res.json(req.body);
      }
    } else {
      console.log("Admin Already Exist");
      res.json({});
    }
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

// Mostrar todos os utilizadores
// Mostrar todos os utilizadores e administradores
adminController.showUsers = async function (req, res) {
  try {
    const users = await User.find({ permission: 2 });
    const admins = await User.find({ permission: 1 });
    res.render('users', { users: users, admins: admins });
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};


adminController.getAllUsers = async function(req, res) {
  try {
      const users = await User.find({});
      res.render('allusers', { users });
  } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Erro ao listar utilizadores.' });
  }
};


// Mostrar utilizador por ID
adminController.showUser = async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user);
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

// Apagar utilizador
adminController.deleteUser = async function (req, res) {
  try {
    console.log('Deleting user with id:', req.params.id);
    const removedUser = await User.deleteOne({ _id: req.params.id });
    console.log('User deleted:', removedUser);
    res.json(removedUser);
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send("Error on the server.");
  }
};


// Perfil do administrador
adminController.profile = async function (req, res) {
  try {
    const admin = await Admin.findOne({ _id: req.adminId });
    res.json(admin);
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

// Mostrar todos os administradores
adminController.showAdmins = async function (req, res) {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

// Mostrar administrador por ID
adminController.showAdmin = async function (req, res) {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    res.json(admin);
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

// Apagar administrador
adminController.deleteAdmin = async function (req, res) {
  try {
    const removedAdmin = await Admin.remove({ _id: req.params.id });
    res.json(removedAdmin);
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

adminController.editProfile = async function (req, res) {
    try {
      const updatedAdmin = await Admin.findByIdAndUpdate(
        req.adminId,
        { $set: req.body },
        { new: true }
      );
      res.json(updatedAdmin);
    } catch (err) {
      res.status(500).send("Error on the server.");
    }
  };

// Atualizar utilizador
// Renderizar a página de edição de usuário
adminController.editUser = async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.render('edituser', { user: user });
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

// Atualizar utilizador
adminController.updateUser = async function (req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};



// Atualizar administrador
adminController.updateAdmin = async function (req, res) {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedAdmin);
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

module.exports = adminController;