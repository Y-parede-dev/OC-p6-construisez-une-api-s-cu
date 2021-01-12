const express = require('express');
const router = express.Router();

const auth = require('../middlleware/auth');
const multer = require('../middlleware/multer-config');

const SaucesCtrl = require('../controllers/sauces');
router.get('/', auth, SaucesCtrl.getAllSauces);
router.post('/', auth,multer,SaucesCtrl.createSauces);
router.post('/:id/like', auth, SaucesCtrl.likeOrNot);
router.get('/:id', auth, SaucesCtrl.getOneSauce);
router.put('/:id', auth, SaucesCtrl.modifySauce);
router.delete('/:id', auth, SaucesCtrl.deleteSauce);

module.exports = router;