var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const ticketController = require('../controllers/ticketController');



router.get('/', function (req, res, next) {
    res.redirect('/login');
});

router.get('/login', authController.checkNotAuthenticated, authController.showLoginPage);
router.get('/register', authController.showRegisterPage);
router.get('/verify-admin', authController.verifyAdmin, (req, res) => {
    res.sendStatus(200);
  });
  
router.post("/ticket", authController.verifyUser, ticketController.purchaseTicket);
router.post('/login', authController.login);
router.post('/register', authController.create );
router.get('/logout', authController.logout);

router.get('/profile', authController.verifyUser, authController.profile);
router.put('/profile', authController.verifyUser, authController.editProfile);


module.exports = router;

