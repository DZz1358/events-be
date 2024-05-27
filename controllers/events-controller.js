const Event = require('../models/eventModel')


const getEvents = (req, res) => {
    Event.find({})
        .then(events => {
            res.status(200).json(events);
        })
        .catch(error => {
            console.error('Error retrieving events:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });

}
const getEvent = (req, res) => {
    const eventId = req.params.id;

    Event.findById(eventId)
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(event);
        }).catch(error => {
            console.error('Error retrieving events:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });

}
const deleteEvent = (req, res) => {
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
        });

}
const addEvent = (req, res) => {
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
}
const addAttendee = (req, res) => {
    const eventId = req.params.id;
    const { name, email, selection, date } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    Event.findById(eventId)
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            event.attendees.push({ name, email, date, selection });
            return event.save();
        })
        .then(updatedEvent => {
            res.status(200).json({ message: 'Attendee successfully added', event: updatedEvent });
        })
        .catch(error => {
            console.error('Error adding attendee:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
}


module.exports = { getEvent, getEvents, deleteEvent, addEvent, addAttendee }





