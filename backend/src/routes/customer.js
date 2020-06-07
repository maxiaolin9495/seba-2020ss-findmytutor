const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer');

router.get('/tutorialForCustomer', customerController.getTutorialsForCustomer);

module.exports = router;