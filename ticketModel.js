const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number, required: true },
  type: { type: String, enum: ['adult', 'child'], required: true },
});

module.exports = mongoose.model('Ticket', ticketSchema);
