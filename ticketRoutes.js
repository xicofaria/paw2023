const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

router.post('/purchase', authController.verifyUser, ticketController.purchaseTicket);

router.get('/tickets', authController.verifyUser, ticketController.getTicketsByUser);

router.get('/alltickets', authController.verifyAdmin, ticketController.getUserTickets);
router.post('/admin/tickets/delete/:id', authController.verifyAdmin, ticketController.deleteTicket);

module.exports = router;
