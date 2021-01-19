const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/sauces');
const auth = require('../middlleware/auth');
const multer = require('../middlleware/multer-config');


// routes post
router.post('/', auth, multer, stuffCtrl.createSauce);
router.post('/:id/like', auth, stuffCtrl.likeOrNot);
//route put
router.put('/:id', auth, multer, stuffCtrl.modifySauce);

//route delete
router.delete('/:id', auth, stuffCtrl.deleteSauce);

// routes get
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.get('/', auth, stuffCtrl.getAllSauces);


module.exports = router;