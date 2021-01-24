const Sauces = require('../models/Sauces');// recuperation du model mongoose
const fs = require('fs'); //importation file system

function isValid(value){
  reGex = /^([^$`|&<">'])\w+$/
  return reGex.test(value);
}

exports.createSauce = (req, res, next) => { // fonction post 

  const sauceObject = JSON.parse(req.body.sauce); // recupération de la req parser
  if(isValid(sauceObject.name)
  && isValid(sauceObject.manufacturer)
  && isValid(sauceObject.description)
  && isValid(sauceObject.mainPepper)){
    delete sauceObject._id;  // supression de l id car mongo DB en crée un automatiquement
    const sauce = new Sauces({ // creation de la nouvelle sauce
        ...sauceObject, // recup. requete deja parser
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` // sert a enregistre l'image envoyer par l'utilisateur
    });
    sauce.save() // apel de la fonction save() pour enregistre dans la base 
      .then(() => res.status(201).json({message: "Objet enregistré !"})) // retour de la promesse 
      .catch(error => res.status(400).json({error})); 
  }else{
    fs.unlink(`images/${req.file.filename}`, () => {
      Sauces.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet non enregistré car les caractères spéciaux ne sont pas pris en compte!'}))
        .catch(error => res.status(400).json({ error }));
    });
  }
};
  

exports.modifySauce = (req, res, next) => { //fonction put
  
  const sauceObjectModify = req.body;
  let isPresent = false; // voir si ok 
  
  if(isValid(sauceObjectModify.name)
  && isValid(sauceObjectModify.manufacturer)
  && isValid(sauceObjectModify.description)
  && isValid(sauceObjectModify.mainPepper)){
    const sauceObject = req.file? // utilisation d'une fonction  trainaire 
    {
      ...JSON.parse(req.body.sauce), // dans le cas ou on souhaite modifier l'image avec ou sans les infos
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      //isPresent = true
    } : {...req.body, isPresent:true};// dans le cas ou nous ne changeons pas l'images

    Sauces.findOne({ _id: req.params.id })  // on trouve la sauce grace a l'id
      .then(sauce => { // si elle est trouver 
        const filename = sauce.imageUrl.split('/images/')[1]; // creation de la const. qui recup le chemin de l'image
          if(!isPresent){
            fs.unlink(`images/${filename}`, () => { // on délie limage (on la suppr. du fichier images)
              Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !(image changer)'}))
                .catch(error => res.status(400).json({ error }));
            });
          }else{
            Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !(image non modifier)'}))
                .catch(error => res.status(400).json({ error }));
          }
        })
      .catch(error => res.status(500).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => { // fonction delete
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
  };

exports.getAllSauces = (req, res, next) => { // fonction get
  Sauces.find()
      .then(sauces=>res.status(200).json(sauces))
      .catch(error=>res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => { // fonction get
  Sauces.findOne( {_id: req.params.id} )
      .then(sauce=>res.status(200).json(sauce))
      .catch(error=>res.status(400).json({error}));
};

exports.likeOrNot = (req, res, next) => { // fonction post (likes dislikes)
  const userId = req.body.userId; // recup. user id de la requete
  const like = req.body.like; // recup. la partie like de la requete ex like:1 = 👍  et like:-1 = 👎

    if(like == 1){ // 👍
      Sauces.updateOne(
        {_id:req.params.id},
        {
          $inc:{likes:1},
          $push:{usersLiked:userId}
        })
        .then(()=>res.status(200).json({message:"like enregistre"}))
        .catch(error=>res.status(400).json(error))
    }else if (like==-1){ // 👎
      Sauces.updateOne(
        {_id:req.params.id},
        {
          $inc:{dislikes:1},
          $push:{usersDisliked:userId}
        }
      )
        .then(()=>res.status(200).json({message:"dislike enregistre"}))
        .catch(error=>res.status(400).json(error))
    }else if(like==0){ // no likes ni dislikes
      Sauces.findOne({_id:req.params.id})
        .then(
          sauces=> {
            if(sauces.usersDisliked.find(userId => userId === req.body.userId)){ // supression du dislike
              Sauces.updateOne(
                {_id:req.params.id},
                {
                  $inc:{dislikes:-1},
                  $pull:{usersDisliked:userId}
                }
              )
                .then(()=>res.status(200).json({message:"dislike Supprimé"}))
                .catch(error=>res.status(400).json(error))
            }else if(sauces.usersLiked.find(userId => userId === req.body.userId)){ // supression du like
              Sauces.updateOne(
                {_id:req.params.id},
                {
                  $inc:{likes:-1},
                  $pull:{usersLiked:userId}
                })
                .then(()=>res.status(200).json({message:"like Supprimé"}))
                .catch(error=>res.status(400).json(error))
            }
          }
        )
    }
  };