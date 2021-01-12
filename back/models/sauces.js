const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');


const saucesSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, unique: true},
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default:0, required: true },
    dislikes: { type: Number, default:0, required: true },
    usersLiked: { type: Array, default:[], required: true, unique: true },
    usersDisliked: { type: Array, default:[], required: true, unique: true }
})

saucesSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Sauces', saucesSchema);

/*

id: ObjectID — identifiant unique créé par MongoDB ; --
● userId: string — identifiant unique MongoDB pour l'utilisateur qui a créé la
sauce ;
● name: string — nom de la sauce ;
● manufacturer: string — fabricant de la sauce ;
● description: string — description de la sauce ;
● mainPepper: string — principal ingrédient dans la sauce ;
● imageUrl: string — string de l'image de la sauce téléchargée par l'utilisateur ;
● heat: number — nombre entre 1 et 10 décrivant la sauce ;
● likes: number — nombre d'utilisateurs qui aiment la sauce ;
● dislikes: number — nombre d'utilisateurs qui n'aiment pas la sauce ;
● usersLiked: [string] — tableau d'identifiants d'utilisateurs ayant aimé la sauce
;
● usersDisliked: [string] — tableau d'identifiants d'utilisateurs n'ayant pas aimé
la sauce.



*/