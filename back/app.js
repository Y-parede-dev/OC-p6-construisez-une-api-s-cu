
// importation des package node 
// express pour cree l'aplication
const express = require('express');
// body parser analise le corp des requettes
const bodyParser = require('body-parser');
// mongoose est un ObjectRelationalMapper en outre il obfusque les requete mais nous veront egalement qu'il a d'autre utilité
const mongoose = require('mongoose');
// path sert comme son nom l'indique a crée des chemin
const path = require('path');
require('dotenv').config();
//const fs = require('fs');

// importation des routes 
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// conection a la base de donnée mongoDb grace a mongoose
mongoose.connect( `mongodb+srv://${process.env.MONGODB_ADMIN}:${process.env.MONGODB_PASSWORD}@p6-construire-une-api-s.y3ru5.mongodb.net/data?retryWrites=true&w=majority`,{ useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(
        () => console.log('Connexion à MongoDB réussie !'))
    .catch(
        () => console.log('Connexion à MongoDB échouée !'));

// création de laplication express
const app = express();

// callback parametrage du header de la requete 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
// callback de l'application
app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);


//exportation de l'application express
module.exports = app;