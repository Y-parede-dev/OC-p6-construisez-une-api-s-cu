//IMPORT package node.js
// bcrypt sert a cree des HASH pour la sécurite des MDP ou autre donée ayant besoin d'etre hasher avant d'etre stocker sur une BDD
const bcrypt = require('bcrypt');
// JsonWebToken cree un jeton de validiter (sert a la conection)
const jwt = require('jsonwebtoken');

const User = require('../models/user');
// reGex email
function isValidEmail(value){
    let reGex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return reGex.test(value);
};
// reGex password (entre 8-15 caract. / au moins 1 chifre 1maj. une min et au moins un carct. spé.)
function isValidPassword(value){
    let reGex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;
    return reGex.test(value)
}

// creation de la fonction sigup
exports.signup = (req, res, next)=>{
    // on cree le hash qui va faire 10 tours 

    bcrypt.hash(req.body.password, 10)
    //si tout est OK on cree un nouveau user
    
        .then(hash => {
            const corpRequete = req.body;
            
            const user = new User({
                email: corpRequete.email,
                //avec le pasword hasher
                password: hash
            });
        // puis on utilise la fonction save pour l'enregistrer dans la base de donee
        if(    isValidEmail(req.body.email)
            && isValidPassword(req.body.password)){
            user.save()
                .then(
                    ()=>res.status(201).json({message:'Utilisateur bien enregistré'}))
                .catch(
                    error=>res.status(400).json(error));
        }else {
            user.watch({_id:user._id})
                .then(
                    ()=>res.status(200).json({message:'Utilisateur non enregistre mot de passe trop faible ou mauvaise adresse email'})
                )
                .catch(
                    error => res.status(400).json(error)
                )
        }   
    })
    // si il y a une erreur retour status 500 erreur serveur
    .catch(
        error=>res.status(500).json(error));

};
    
// creation de la fonction login
exports.login = (req, res, next)=>{
    //utilisation de la fonction findOne() pour trouver l'utilisateur dans BDD
    User.findOne({email: req.body.email})
        .then(user=> {
            // si user n'existe pas retourne message d'erreur
            if(!user){
                return res.status(401).json({message:'User not found'})
            }
            //bcrypt compare les Hash grace a ca fonction compare()
            bcrypt.compare(req.body.password, user.password)
                .then(
                    valid=>{
                    if(!valid){
                        return res.status(401).json({message:'not good password'})
                    }
                    //si tout est OK statut 200 , et creation du 'jeton' token de conection
                    res.status(200).json({
                        userId : user.id,
                        token:jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn:'1h'}
                        )
                    })
                })
                .catch(
                    error=>res.status(500).json(error))
        })
        .catch(
            error=>res.status(500).json(error))
};