const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete req.body._id;
  const sauce = new Sauces({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({message: "Objet enregistré !"}))
    .catch(error => res.status(400).json({error})); 
};

exports.modifySauce = (req, res, next) => {
  
  const sauceObject = req.file?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};

  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));

      });
    })
    .catch(error => res.status(500).json({ error }));
  };

exports.deleteSauce = (req, res, next) => {
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

exports.getAllSauces = (req, res, next) => { 
  Sauces.find()
      .then(sauces=>res.status(200).json(sauces))
      .catch(error=>res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => { 
  Sauces.findOne( {_id: req.params.id} )
      .then(sauce=>res.status(200).json(sauce))
      .catch(error=>res.status(400).json({error}));
};

exports.likeOrNot = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;

    if(like == 1){
      Sauces.updateOne(
        {_id:req.params.id},
        {
          $inc:{likes:1},
          $push:{usersLiked:userId}
        })
        .then(()=>res.status(200).json({message:"like enregistre"}))
        .catch(error=>res.status(400).json(error))
    }else if (like==-1){
      Sauces.updateOne(
        {_id:req.params.id},
        {
          $inc:{dislikes:1},
          $push:{usersDisliked:userId}
        }
      )
        .then(()=>res.status(200).json({message:"dislike enregistre"}))
        .catch(error=>res.status(400).json(error))
    }else if(like==0){
      Sauces.findOne({_id:req.params.id})
        .then(
          sauces=> {
            if(sauces.usersDisliked.find(userId => userId === req.body.userId)){
              Sauces.updateOne(
                {_id:req.params.id},
                {
                  $inc:{dislikes:-1},
                  $pull:{usersDisliked:userId}
                }
              )
                .then(()=>res.status(200).json({message:"dislike Supprimé"}))
                .catch(error=>res.status(400).json(error))
            }else if(sauces.usersLiked.find(userId => userId === req.body.userId)){
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