const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/uploadTutorProfile', userController.uploadTutorProfile);
router.post('/uploadCustomerProfile', userController.uploadCustomerProfile);
router.get('/tutorProfile', userController.getTutorProfile);
router.get('/customerProfile', userController.getCustomerProfile);
module.exports = router;