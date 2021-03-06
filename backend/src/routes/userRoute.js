const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleWares = require('../middleWares');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.put('/cancelTutorial', middleWares.checkAuthentication, userController.cancelTutorial);
router.put('/closeTutorial', middleWares.checkAuthentication, userController.closeTutorial);
router.post('/getAllTutorials', middleWares.checkAuthentication, userController.getAllTutorials);
router.get('/getTutorial/:tutorialId', userController.getTutorialById);
router.get('/getAllTutorials/:tutorId', userController.getAllTutorialsByTutorId);
router.get('/getAllReviews/:tutorId', userController.getAllReviewsByTutorId);
router.get('/tutorialForTutor', middleWares.checkAuthentication,userController.getTutorialsForTutor);
router.get('/tutorialForCustomer', middleWares.checkAuthentication,userController.getTutorialsForCustomer);

module.exports = router;