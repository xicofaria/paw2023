const Ticket = require('../models/ticketModel');
const Event = require('../models/event');


const ticketController = {};


ticketController.purchaseTicket = async function (req, res) {
  try {
    const eventId = req.body.eventId;
    const ticketType = req.body.type;
    const userId = req.user._id; 

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ message: 'Evento não encontrado' });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).send({ message: 'Lugares esgotados para este evento' });
    }

    let price;
    if (ticketType === 'adult' || !event.childPrice) {
      price = event.price;
    } else {
      price = event.childPrice;
    }

    const ticket = new Ticket({
      eventId: eventId,
      userId: userId, 
      type: ticketType,
      price: price,
    });

    await ticket.save();

    // Atualize a capacidade de lugares do evento
    event.availableSeats -= 1;
    await event.save();

    res.redirect(`/tickets?successMessage=${encodeURIComponent('Bilhete comprado com sucesso')}`);
  } catch (error) {
    console.log(error); 
    res.status(500).send({ message: 'Erro ao comprar bilhete' });
  }
};



ticketController.getTicketsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const successMessage = req.query.successMessage;

    try {
      const tickets = await Ticket.find({ userId }).populate({ path: 'eventId', model: 'Event' }).exec();

      // Agrupar bilhetes por evento e tipo
      const groupedTickets = tickets.reduce((acc, ticket) => {
        if (ticket.eventId) { // Verificar se eventId existe
          const key = `${ticket.eventId._id.toString()}-${ticket.type}`; // Usar o ID do evento e o tipo como chave
          if (!acc[key]) {
            acc[key] = { ...ticket._doc, count: 1 };
          } else {
            acc[key].count += 1;
          }
        }
        return acc;
      }, {});

      res.render('usertickets', { tickets: Object.values(groupedTickets), successMessage });
    } catch (queryError) {
      console.log(queryError); // Adicionar log do erro
      return res.status(403).send('Erro ao listar bilhetes de user.');
    }
  } catch (error) {
    console.log(error); // Adicionar log do erro
    return res.status(403).send('Erro ao listar.');    
  }
};



ticketController.getUserTickets = async function(req, res) {
  try {
    const tickets = await Ticket.find({}).populate({ path: 'eventId', model: 'Event' }).populate({ path: 'userId', model: 'User' }).exec();

    // Agrupar os bilhetes por utilizador, evento e tipo de bilhete
    const groupedTickets = tickets.reduce((acc, ticket) => {
        if (ticket.userId && ticket.eventId) { // Verificar se userId e eventId existem
            const key = ticket.userId._id.toString() + ticket.eventId._id.toString() + ticket.type; // Usar o ID do utilizador, o ID do evento e o tipo do bilhete como chave
            if (!acc[key]) {
                acc[key] = { ...ticket._doc, count: 1 };
            } else {
                acc[key].count += 1;
            }
        }
        return acc;
    }, {});
    
    console.log(Object.values(groupedTickets)); // Vai mostrar no console os bilhetes agrupados por utilizador, evento e tipo de bilhete
    res.render('alltickets', { tickets: Object.values(groupedTickets) });
    
    
  } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Erro ao listar bilhetes do utilizador.' });
  }
};

ticketController.deleteTicket = async function(req, res) {
  try {
    const ticketId = req.params.id;
    await Ticket.findByIdAndRemove(ticketId);
    res.redirect('/alltickets');  // Redirecionar para a página de todos os bilhetes
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao tentar eliminar o bilhete.');
  }
};


module.exports = ticketController;
