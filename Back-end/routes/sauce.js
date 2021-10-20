//EXPRESS
const express = require('express');
//Router
const router = express.Router();
//Multer
//const multer = require('multer');
const multer = require('../middleware/multer-config')

//Lien avec le controller
const sauceCtrl = require('../controllers/sauce');
//auth
const auth = require ('../middleware/auth')

//Routes
router.post('/', multer, sauceCtrl.creation);
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifyOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', sauceCtrl.like);
//Export
module.exports = router;