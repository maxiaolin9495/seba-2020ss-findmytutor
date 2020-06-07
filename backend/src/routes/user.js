const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const middlewares = require('../middlewares')

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/uploadCustomerProfile', middlewares.checkAuthentication, userController.uploadCustomerProfile);
router.get('/customerProfile', middlewares.checkAuthentication, userController.getCustomerProfile);
router.put('/createTutorial', userController.createTutorial);
router.post('/cancelTutorial', userController.cancelTutorial);
router.post('/closeTutorial', userController.closeTutorial);
module.exports = router;