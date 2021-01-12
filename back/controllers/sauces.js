const Sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauces = (req,res,next)=>{
    const sauceRecu = JSON.parse(req.body.sauce);
    delete sauceRecu._id
    
    const sauce = new Sauces({
        ...sauceRecu,
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[],
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(()=>res.status(201).json({message:'sauces enregistré'}))
        .catch(error=>res.status(400).json({error}))
};
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces =>res.status(200).json(sauces))
        .catch(error=>res.status(400).json({error}));
};
exports.getOneSauce = (req,res,next) => {
    Sauces.findOne( {_id:req.params.id} )
        .then(sauce=>res.status(200).json(sauce))
        .catch(error=>res.status(400).json({error}));
};
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
exports.modifySauce = (req, res, next) => {
    Sauces.updateOne( {_id:req.params.id}, {...req.body, _id:req.params.id})
        .then(()=>res.status(200).json({message:'sauce modifié'}))
        .catch(error=>res.status(400).json({error}));
};
exports.likeOrNot = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    
    if(like == 1){
        Sauces.updateMany(
            {_id:sauceId},
                {
                    $inc: {likes:1},
                    $push: {usersLiked :userId}
                }
            )
            .then(()=>res.status(200).json({message:`L'utilisateur aime pas la sauce`}))
            .catch(error => res.status(400).json(error))
        }else if (like == -1){
            Sauces.updateMany(
                { _id:sauceId},
                    {
                        $inc: {dislikes:1},
                        $push: {usersDisliked :userId}
                    }
                )
                .then(()=>res.status(200).json({message:`L'utilisateur n'aime pas la sauce`}))
                .catch(error => res.status(400).json(error))
        }
        else if (like == 0) {
            Sauces.findOne({_id:req.params.id})
            .then((sauces)=>{
                if (sauces.usersLiked.find(userId=> userId === req.body.userId)) {
                    Sauces.updateMany(
                        { _id:sauceId},
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: userId } 
                            }
                    )
                    .then(()=>res.status(200).json({message:`L'utilisateur N'aime pas la sauce mais il a changer d'avis`}))
                    .catch(error=> res.status(400).json(error))
                }else{
                    Sauces.updateMany(
                        {_id:sauceId},
                            {
                                $inc:{ dislikes:-1},
                                $pull:{usersDisliked: userId}
                            }
                    )
                    .then(()=>res.status(200).json({message:`L'utilisateur aime la sauce mais il a changer d'avis`}))
                    .catch(error=> res.status(400).json(error))
                    }
                }
            ) 
            .catch(error=>res.status(500).json(error))
        } 
    
    };