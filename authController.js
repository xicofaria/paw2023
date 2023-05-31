var User = require("../models/user");
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../jwt_secret/setting');

var authController = {};

authController.logout = function (req, res) {
  res.clearCookie('auth_token');
  res.redirect('/login');
};

authController.create = async function (req, res) {
  var user = new User(req.body);
  user.password = bcrypt.hashSync(req.body.password, 8);
  user.permission = req.body.permission || 0;

  try {
    const dbUsers = await User.findOne({ email: req.body.email }).exec();
    if (dbUsers === null) {
      try {
        await user.save();
        return res.json({ success: true }); // corrigir isto
      } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Error on the server.' }); 
      }
    } else {
      return res.json({ success: false, message: 'Utilizador ou email ja existem' }); 
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Error on the server.' });  
  }
}


authController.login = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: 'Utilizador nao encontrado' });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(403).send({ message: 'Password Invalida' });
    }

    const token = jwt.sign({ id: user._id, permission: user.permission }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // Armazenar o token como um cookie
    //res.cookie('auth_token', token, { maxAge: 86400 * 1000 }, { httpOnly: true }); // A duração do cookie deve corresponder à duração do token
    //return res.status(200).json({ auth: true, token: token });
    res.json({ auth: true, token: token});


    //res.redirect('/events'); // rota desejada após o login bem-sucedido
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error on the server.' });
  }

};


authController.showLoginPage = function (req, res) {
  res.render('login');
};

authController.showRegisterPage = function (req, res) {
  res.render('register');
};

// Verificar se o utilizador é um administrador
authController.verifyAdmin = async function (req, res, next) {
  try {
    // Obter o token do cabeçalho da requisição
    const token = req.cookies.auth_token;
    if (!token)
      return res.redirect('/events');


    // Verificar o token
    jwt.verify(token, config.secret, async function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: 'Failed to authenticate token.' });

      // Encontrar o utilizador pelo ID fornecido no token
      const user = await User.findById(decoded.id, { password: 0 });

      if (!user) {
        return res.status(404).send('No user found.');
      }

      // Verificar se a permissão do utilizador é de administrador
      if (user.permission !== 1) {
       // return res.redirect(
        //  '/events?error=Access+denied.+You+are+not+an+admin.+You+will+be+redirected+to+the+appropriate+page.'
        //);
          return res.status(403).send('Access denied. Not an admin.');
      }

      // Se tudo estiver ok, salvar o ID do usuário no objeto da requisição
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    return res.status(500).send('Error on the server.');
  }
};

authController.verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.redirect('/login');
    }
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect('/login');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ message: 'Erro ao verificar o utilizador' });
  }
};

authController.checkNotAuthenticated = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (token) {
    return res.redirect('/events');
  }
  next();
};



authController.findAccount = function (req, res, next) {
  // ...
}

authController.profile = async function (req, res) {
  try {
    const dbUsers = await User.findOne({ _id: req.userId }).exec();
    res.json(dbUsers);
  } catch (err) {
    res.status(500).send('Error on the server.');
  }
}

authController.editProfile = async function (req, res) {
  try {
    const tmp = await User.findOne({ _id: req.userId }).exec();
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
      try {
        const editedUser = await User.findByIdAndUpdate(req.userId, req.body);
        res.json(editedUser);
      } catch (err) {
        res.status(500).send('Error on the server.');
      }
    } else {
      delete req.body.password;
      try {
        const editedUser = await User.findByIdAndUpdate(req.userId, req.body);
        res.json(editedUser);
      } catch (err) {
        res.status(500).send('Error on the server.');
      }
    }
  } catch (err) {
    res.status(500).send('Error on the server.');
  }
}

module.exports = authController;
