// IMPORT des package node.js
//Ici mongoose va nous servir a cree un schema de donné 
const mongoose = require('mongoose');
// unique Validator sert a par exemple n'accepter qu'une seule adress email par compte 
const uniqueValidator = require('mongoose-unique-validator');
// creation du schema mongoose
const userSchema = mongoose.Schema({
    email:{type:String, required: true},
    password:{type:String, required: true}
});

// ajout du plugin
userSchema.plugin(uniqueValidator);

//exportation du module sous forme de model mongoose
module.exports = mongoose.model("User", userSchema);