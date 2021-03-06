const express = require('express');
const router = express.Router();
const middleWares = require('../middleWares');
const tutorController = require('../controllers/tutorController');

router.put('/uploadTutorProfile', middleWares.checkAuthentication, tutorController.uploadTutorProfile);
router.put('/confirmTutorial', middleWares.checkAuthentication,tutorController.confirmTutorial);
router.get('/tutorProfile', middleWares.checkAuthentication, tutorController.getTutorProfile);
router.get('/tutorProfileById',tutorController.getTutorProfileById);
router.get('/autoComplete', tutorController.autoCompleteForSearch);
router.get('/Search', tutorController.searchTutor);
router.get('/searchTutorByEmail', tutorController.searchTutorByEmail);

module.exports = router;