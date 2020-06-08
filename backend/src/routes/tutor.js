const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');
const tutorController = require('../controllers/tutor');

router.get('/tutorialForTutor', tutorController.getTutorialsForTutor);
router.post('/uploadTutorProfile', middlewares.checkAuthentication, tutorController.uploadTutorProfile);
router.post('/confirmTutorial', tutorController.confirmTutorial);
router.get('/tutorProfile', middlewares.checkAuthentication, tutorController.getTutorProfile);
router.get('/tutorProfilebyId',tutorController.getTutorProfileById);
module.exports = router;