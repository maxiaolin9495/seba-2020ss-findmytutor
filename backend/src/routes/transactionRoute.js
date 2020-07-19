const express = require('express');
const router = express.Router();
const middleWares = require('../middleWares');
const transactionController = require('../controllers/transactionController');

router.get('/getTransaction/:payer', middleWares.checkAuthentication,transactionController.getTransaction);
router.post('/createTransaction', middleWares.checkAuthentication, transactionController.createTransaction);

module.exports = router;