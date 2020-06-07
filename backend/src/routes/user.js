const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const middlewares = require('../middlewares')

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/uploadTutorProfile', userController.uploadTutorProfile);
router.post('/uploadCustomerProfile', userController.uploadCustomerProfile);
router.get('/tutorProfile', middlewares.checkAuthentication, userController.getTutorProfile);
router.get('/customerProfile', middlewares.checkAuthentication, userController.getCustomerProfile);
module.exports = router;