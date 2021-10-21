const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const passwordValidator = require ('../middleware/passwordValidator');

require('dotenv').config()

exports.signup = (req, res, next)=>{
  if(passwordValidator.validate(req.body.password)){
    var key = CryptoJS.enc.Hex.parse(process.env.Crypto_key); 
    var iv = CryptoJS.enc.Hex.parse(process.env.Crypto_iv); 
    let encryptedMail = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
  
      bcrypt.hash(req.body.password, 10)
      .then((hash) => {
          const user = new User({
              email: encryptedMail,
              password: hash
          });
      user.save()
      .then(()=> res.status(201).json({ message : 'objet enregistré' }))
      .catch(error => res.status(400).json({ error }));
      })
  }else{
    return res.status(400).json({ message: 'Le mot de passe doit contenir au minimum: deux chiffres, une minuscule, une majuscule et être composé de minimum 8 caractères !' })
  }
 
  }

exports.login = (req, res, next) => {
  var key = CryptoJS.enc.Hex.parse(process.env.Crypto_key); 
  var iv = CryptoJS.enc.Hex.parse(process.env.Crypto_iv); 
  let encryptedMail = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();

    User.findOne({ email: encryptedMail })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
                res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.TOKEN_SECRET,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error =>  res.status(500).json({ error: 'bcrypt compare' }));
      })
      .catch(error => res.status(500).json({ error }));
  };
