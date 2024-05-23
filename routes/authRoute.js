const express = require('express');
const { mailVerification } = require('../controller/userController');
const router = express();

router.use(express.json());

router.get('/mail-verification', mailVerification)

module.exports = router