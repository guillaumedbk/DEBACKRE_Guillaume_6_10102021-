const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//EVITER LES ERREURS DE CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//CONNEXION BDD
mongoose.connect('mongodb+srv://Guillaume:Guillaume@cluster0.oaur9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json()); 

//Importation des éléments
const routeUser = require('./routes/user')
const routeSauce = require ('./routes/sauce')

//Redirections vers les routes
app.use('/api/auth/', routeUser);
app.use('/api/sauces', routeSauce);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;


