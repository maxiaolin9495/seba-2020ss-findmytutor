const express = require('express');
const router = express.Router();
const middleWares = require('../middleWares');
const customerController = require('../controllers/customerController');

router.put('/uploadCustomerProfile', middleWares.checkAuthentication, customerController.uploadCustomerProfile);
router.get('/customerProfile', middleWares.checkAuthentication, customerController.getCustomerProfile);
router.post('/review', middleWares.checkAuthentication, customerController.createReview);
router.post('/createTutorial', middleWares.checkAuthentication, customerController.createTutorial);
router.put('/review/:reviewId', middleWares.checkAuthentication, customerController.updateReview);
router.get('/review/:reviewId', middleWares.checkAuthentication, customerController.getReview);
router.get('/searchCustomerByEmail', customerController.searchCustomerByEmail);
router.post('/contactTutor', customerController.contactTutor);
module.exports = router;