const Event = require('../models/event');

const eventController = {};

eventController.addEvent = async function (req, res) {
  try {
    const { name, location, date, time, price, capacity } = req.body;

    const newEvent = new Event({
      name,
      location,
      date,
      time,
      price,
      capacity,
      availableSeats: capacity,
    });

    await newEvent.save();
    res.redirect('/events');
  } catch (error) {
    res.redirect('/add-event?error=Erro+ao+criar+o+evento');
  }
};
eventController.showAddEventForm = function (req, res) {
  res.render('addEvent');
};


eventController.listEvents = async function (req, res) {
  try {
    const events = await Event.find();
    const success = req.query.success;
    const error = req.query.error;
    res.json(events);

  //  res.render('events', { events, success, error });
  } catch (error) {
    //res.status(500).send({ message: 'Erro ao listar eventos' });
    res.status(500).json({ success: false, message: 'Erro ao listar o evento' });

  }
};

eventController.editEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    if (event) {
      res.status(200).json({ success: true, message: 'Evento atualizado com sucesso!' });
    } else {
      res.status(404).json({ success: false, message: 'Evento não encontrado.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar evento.' });
  }
};

eventController.deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findByIdAndRemove(eventId);
    if (event) {
      res.redirect('/events');
    } else {
      res.status(404).send({ message: 'Evento não encontrado.' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Erro ao excluir evento.' });
  }
};

eventController.showEditForm = async function (req, res) {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ message: 'Evento não encontrado' });
    }
    res.render('editEvent', { event });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao exibir o formulário de edição' });
  }
};

// Controlador para buscar todos os eventos
eventController.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controlador para procurar um evento pelo ID
eventController.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

eventController.showPurchaseForm = async function (req, res) {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ message: 'Evento não encontrado' });
    }
    res.render('purchaseTicket', { event });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao exibir formulário de compra' });
  }
};


module.exports = eventController;
