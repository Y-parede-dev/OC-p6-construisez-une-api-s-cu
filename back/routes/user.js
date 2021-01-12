// IMPORT package node.js
const express = require('express');

// creation d'un rooter express
const router = express.Router();


const userCtrl = require('../controllers/user');

// creation des routes pour la creation de compte et la conection
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);

module.exports = router;