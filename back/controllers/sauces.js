//IMPORT du model Sauces
const Sauces = require('../models/sauces');
// import de file systeme qui sert a l'interation avec des fichiers ext.
const fs = require('fs');

// creation de la fontion createsauces() 
exports.createSauces = (req,res,next)=>{
    // recuperation de la requete parser en json
    const sauceRecu = JSON.parse(req.body.sauce);
    // supression de l"id de la requette car Mongo db va en asigner un automatiquement
    delete sauceRecu._id
    
    // creation de la sauce
    const sauce = new Sauces({
        // ...sauceRecu recupere l'integralité de la requete 
        ...sauceRecu,
        // puis on initialiser la partie likes/dislikes (sur 0  et des tabl. vides car produit 'neuf ')
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[],
        // ici nous recuperons l'image donne par le user a la creation de la sauces
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // appel de la fonction save pour l'enregistrer dans la BDD
    sauce.save()
        .then(
            ()=>res.status(201).json({message:'sauces enregistré'}))
        .catch(
            error=>res.status(400).json({error}))
};
// creation des fontions qui montrent toutes les sauces , ou au details , qui permet de modifier et suprimer une sauce
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(
            sauces =>res.status(200).json(sauces))
        .catch(
            error=>res.status(400).json({error}));
};
exports.getOneSauce = (
    req,res,next) => {
        Sauces.findOne( {_id:req.params.id} )
            .then(
                sauce=>res.status(200).json(sauce))
            .catch(
                error=>res.status(400).json({error}));
};
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(
            sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(
                () => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(
                error => res.status(400).json({ error }));
        });
      })
      .catch(
          error => res.status(500).json({ error }));
  };
exports.modifySauce = (req, res, next) => {
    Sauces.updateOne( {_id:req.params.id}, {...req.body, _id:req.params.id})
        .then(
            ()=>res.status(200).json({message:'sauce modifié'}))
        .catch(
            error=>res.status(400).json({error}));
};

// fonction qui gere les likes dislikes
exports.likeOrNot = (req, res, next) => {
    //recuperation des partie de la requete a traiter 
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    // si like = 1 
    if(like == 1){
        // on appele la fonction updatemany() pour la mise a jour du comteur de like et du tableau usersLiked
        Sauces.updateMany(
            {_id:sauceId},
                {
                    $inc: {likes:1},
                    $push: {usersLiked :userId}
                }
            )
            .then(
                ()=>res.status(200).json({message:`L'utilisateur aime pas la sauce`}))
            .catch(
                error => res.status(400).json(error))
        //si like = -1
        }else if (like == -1){
            // on appele la fonction updatemany() pour la mise a jour du comteur de dislike et du tableau usersDisliked
            Sauces.updateMany(
                { _id:sauceId},
                    {
                        $inc: {dislikes:1},
                        $push: {usersDisliked :userId}
                    }
                )
                .then(
                    ()=>res.status(200).json({message:`L'utilisateur n'aime pas la sauce`}))
                .catch(
                    error => res.status(400).json(error))
        }// si like =0
        else if (like == 0) {
            // utilisation de la fonction findOne() pour trouver l' _id qui est egal au paramete id de la requete
            Sauces.findOne({_id:req.params.id})
            .then(
                (sauces)=>{
                //si utilisateur est trouver dans le tableau usersLiked[]
                if (sauces.usersLiked.find(userId => userId === req.body.userId)) {
                    Sauces.updateMany(
                        { _id:sauceId},
                            {   // on desincrement likes et on suprime l'utilisasteur du tableau
                                $inc: { likes: -1 },
                                $pull: { usersLiked: userId } 
                            }
                    )
                    .then(
                        ()=>res.status(200).json({message:`L'utilisateur N'aime pas la sauce mais il a changer d'avis`}))
                    .catch(
                        error=> res.status(400).json(error))
                    // si l'utilisateur se trouve dans le tableau usersDisliked[]
                }else{
                    Sauces.updateMany(
                        {_id:sauceId},
                            {   // on desincrement dislikes et on suprime l'utilisasteur du tableau
                                $inc:{ dislikes: -1},
                                $pull:{usersDisliked: userId}
                            }
                    )
                    .then(
                        ()=>res.status(200).json({message:`L'utilisateur aime la sauce mais il a changer d'avis`}))
                    .catch(
                        error=> res.status(400).json(error))
                    }
                }
            ) 
            .catch(
                error=>res.status(500).json(error))
        } 
    
    };