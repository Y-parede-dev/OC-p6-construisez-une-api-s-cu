//IMPORT express
const express = require('express');
//creation du rooter express
const router = express.Router();
//IMPORT des middlleware pour l'authentification et la config de multer 
const auth = require('../middlleware/auth');
const multer = require('../middlleware/multer-config');
//IMPORT du controlleur sauces
const SaucesCtrl = require('../controllers/sauces');
// creation des différentes routes
router.get('/', auth, SaucesCtrl.getAllSauces);
router.post('/', auth,multer,SaucesCtrl.createSauces);
router.post('/:id/like', auth, SaucesCtrl.likeOrNot);
router.get('/:id', auth, SaucesCtrl.getOneSauce);
router.put('/:id', auth, SaucesCtrl.modifySauce);
router.delete('/:id', auth, SaucesCtrl.deleteSauce);

//EXPORT du module de router
module.exports = router;