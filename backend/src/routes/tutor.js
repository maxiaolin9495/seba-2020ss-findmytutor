const express = require('express');
const router = express.Router();
const middleWares = require('../middleWares');
const tutorController = require('../controllers/tutor');

router.get('/tutorialForTutor', middleWares.checkAuthentication,tutorController.getTutorialsForTutor);
router.post('/uploadTutorProfile', middleWares.checkAuthentication, tutorController.uploadTutorProfile);
router.post('/confirmTutorial', middleWares.checkAuthentication,tutorController.confirmTutorial);
router.get('/tutorProfile', middleWares.checkAuthentication, tutorController.getTutorProfile);
router.get('/tutorProfileById',tutorController.getTutorProfileById);
router.get('/autoComplete', tutorController.autoCompleteForSearch);
router.get('/search', tutorController.searchTutor);
module.exports = router;