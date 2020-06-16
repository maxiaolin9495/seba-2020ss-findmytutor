const express = require('express');
const router = express.Router();
const middleWares = require('../middleWares');
const customerController = require('../controllers/customer');

router.get('/tutorialForCustomer', middleWares.checkAuthentication, customerController.getTutorialsForCustomer);
router.post('/uploadCustomerProfile', middleWares.checkAuthentication, customerController.uploadCustomerProfile);
router.get('/customerProfile', middleWares.checkAuthentication, customerController.getCustomerProfile);
router.post('/createReview', middleWares.checkAuthentication, customerController.createReview);
router.put('/updateReview/:reviewId', middleWares.checkAuthentication, customerController.updateReview);
module.exports = router;