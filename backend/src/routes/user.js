const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const middlewares = require('../middlewares')

router.post('/login', userController.login);
router.post('/register', userController.register);
router.put('/createTutorial', middlewares.checkAuthentication, userController.createTutorial);
router.post('/cancelTutorial', middlewares.checkAuthentication, userController.cancelTutorial);
router.post('/closeTutorial', middlewares.checkAuthentication, userController.closeTutorial);
module.exports = router;