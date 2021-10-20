//EXPRESS
const express = require('express');
//Lien avec le controller
const userCtrl = require('../controllers/user');
//Router
const router = express.Router();

//Routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Export
module.exports = router;
