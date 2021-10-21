const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passwordValidator = require ('../middleware/passwordValidator');

require('dotenv').config()

exports.signup = (req, res, next)=>{
  if(passwordValidator.validate(req.body.password)){
    
      bcrypt.hash(req.body.password, 10)
      .then((hash) => {
          const user = new User({
              email: req.body.email,
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
  
    User.findOne({ email: req.body.email, })
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
