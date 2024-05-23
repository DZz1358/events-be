const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Event = require('./models/event')
const cors = require('cors');

const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
// const db = 'mongodb+srv://saloed2206:9hGcy35NGTatFrUy@cluster0.bz6s6ax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const db = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(cors());

mongoose
    .connect(db)
    .then((res) => console.log('connect to DB'))
    .catch((error) => console.log('error'))


app.get('/events', (req, res) => {
  Event.find({})
      .then(events => {
          res.status(200).json(events);
      })
      .catch(error => {
          console.error('Error retrieving events:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      });
});
app.get('/event/:id', (req, res) => {
  const eventId = req.params.id;

  Event.findById(eventId)
      .then(event => {
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
    res.status(200).json(event);
      })      .catch(error => {
          console.error('Error retrieving events:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      });
});

app.delete('/events/:id', (req, res) => {
  const eventId = req.params.id;

  Event.findByIdAndDelete(eventId)
  .then(deletedEvent => {
      if (!deletedEvent) {
          return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event successfully deleted', event: deletedEvent });
  })
  .catch(error => {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  });});

app.post('/add-event', (req, res) => {
  const { title, description, date, author } = req.body;

  if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
  }

  const newEvent = new Event({ title, description, date, author });

  newEvent.save()
      .then(event => {
          res.status(201).json({ message: 'Event successfully added', eventData: event });
      })
      .catch(error => {
          console.log('Error saving event:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      });
});

app.post('/event/:id/add-attendee', (req, res) => {
  const eventId = req.params.id;
  const { name, email, selection, date} = req.body;

  if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
  }

  Event.findById(eventId)
      .then(event => {
          if (!event) {
              return res.status(404).json({ message: 'Event not found' });
          }

          event.attendees.push({ name, email, date, selection});
          return event.save();
      })
      .then(updatedEvent => {
          res.status(200).json({ message: 'Attendee successfully added', event: updatedEvent });
      })
      .catch(error => {
          console.error('Error adding attendee:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      });
});



app.use((req, res) => {
    res
    .status(500)
    .send('<h1>Мимо Брат,мимо</h1>')
})

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

