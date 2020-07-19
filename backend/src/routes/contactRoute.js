const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');

router.post('/saveMessage', contactController.saveMessage);

module.exports = router;