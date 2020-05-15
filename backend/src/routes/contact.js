const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contact');

router.post('/saveMessage', contactController.saveMessage);

module.exports = router;