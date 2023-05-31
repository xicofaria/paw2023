const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/authController');


// Event routes
router.get('/add-event', authController.verifyAdmin, eventController.showAddEventForm);
router.post('/create-event', authController.verifyAdmin, eventController.addEvent);

router.get('/events', authController.verifyUser, eventController.listEvents);
router.get('/event/:id/edit', authController.verifyAdmin, eventController.showEditForm);
router.post('/event/:id/edit', authController.verifyAdmin, eventController.editEvent);
router.get('/event/:id/delete', authController.verifyAdmin, eventController.deleteEvent);

  
// Ticket purchase form
router.get('/tickets/purchase/:eventId', authController.verifyUser, eventController.showPurchaseForm );
// Ticket routes

module.exports = router;

