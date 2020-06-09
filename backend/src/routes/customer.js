const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer');

router.get('/tutorialForCustomer', middlewares.checkAuthentication, customerController.getTutorialsForCustomer);
router.post('/uploadCustomerProfile', middlewares.checkAuthentication, customerController.uploadCustomerProfile);
router.get('/customerProfile', middlewares.checkAuthentication, customerController.getCustomerProfile);
module.exports = router;