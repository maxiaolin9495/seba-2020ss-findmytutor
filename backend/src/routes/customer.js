const express = require('express');
const router = express.Router();
const middleWares = require('../middleWares');
const customerController = require('../controllers/customer');

router.get('/tutorialForCustomer', middleWares.checkAuthentication, customerController.getTutorialsForCustomer);
router.put('/uploadCustomerProfile', middleWares.checkAuthentication, customerController.uploadCustomerProfile);
router.get('/customerProfile', middleWares.checkAuthentication, customerController.getCustomerProfile);
router.post('/createReview', middleWares.checkAuthentication, customerController.createReview);
router.put('/updateReview/:reviewId', middleWares.checkAuthentication, customerController.updateReview);
router.get('/searchCustomerByEmail', customerController.searchCustomerByEmail);
module.exports = router;