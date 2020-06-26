const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const middleWares = require('../middleWares');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/createTutorial', middleWares.checkAuthentication, userController.createTutorial);
router.put('/cancelTutorial', middleWares.checkAuthentication, userController.cancelTutorial);
router.put('/closeTutorial', middleWares.checkAuthentication, userController.closeTutorial);
router.post('/getAllTutorials', middleWares.checkAuthentication, userController.getAllTutorials);
router.get('/getTutorial/:tutorialId', userController.getTutorialById);
router.get('/getAllTutorials/:tutorId', userController.getAllTutorialsByTutorId);
router.get('/getAllReviews/:tutorId', userController.getAllReviewsByTutorId);
module.exports = router;