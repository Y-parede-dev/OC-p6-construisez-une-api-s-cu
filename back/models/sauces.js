// IMPORT des package node.js
//Ici mongoose va nous servir a cree un schema de donné 
const mongoose = require('mongoose');

// creation du schema mongoose
const saucesSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true},
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number,default:0},
    dislikes: { type: Number, default:0},
    usersLiked: { type: Array, default:[]},
    usersDisliked: { type: Array,default:[]}
})

//exportation du module sous forme de model mongoose

module.exports = mongoose.model('Sauces', saucesSchema);

