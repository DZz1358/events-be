const express = require('express');
const { getEvent, getEvents, deleteEvent, addEvent, addAttendee } = require('../controllers/events-controller');



const router = express.Router();


router.get('/events', getEvents);
router.get('/event/:id', getEvent);
router.delete('/events/:id', deleteEvent);
router.post('/add-event', addEvent);
router.post('/event/:id/add-attendee', addAttendee);



module.exports = router;