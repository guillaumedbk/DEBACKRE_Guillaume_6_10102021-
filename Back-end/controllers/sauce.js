const Sauce = require('../models/sauces');
const fs = require('fs');

exports.creation = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked:[],
    usersDisliked:[]
    })
    sauce.save()
    .then(()=> res.status(201).json({ réussi: 'objet crée correctement'}))
    .catch(error => res.status(400).json({error}))
};

exports.getAllSauces = (req, res, next) =>{
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id })
    .then(sauce =>{
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () =>{
            Sauce.deleteOne({ _id: req.params.id })
            .then(sauce => res.status(200).json({message: 'objet supprimé'}))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({ error }));
}

exports.modifyOneSauce = (req, res, next) =>{
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };


exports.like = (req, res, next)=>{
    const like = req.body.like;
    const userId = req.body.userId;
    const id = req.params.id;

    if (like == 1){
      Sauce.updateOne({_id: id}, {$addToSet: {usersLiked : userId}, $inc : {likes : +1}})
        .then(()=>res.status(200).json({message:"like !"}))
        .catch(error => res.status(400).json({ error }));

    }else if(like == -1){
      Sauce.updateOne({_id: id}, {$addToSet: {usersDisliked : userId}, $inc : {dislikes : +1}})
        .then(()=>res.status(200).json({message:"dislike !"}))
        .catch(error => res.status(400).json({ error }));

    }else{
      Sauce.findOne({_id: id})
        .then(sauce =>{
          if (sauce.usersLiked.includes(userId)){
            Sauce.updateOne({_id: id}, {$pull: {usersLiked : userId}, $inc : {likes : -1}})
              .then(()=>res.status(200).json({message:"id enlevé du tableau userLiked"}))
              .catch(error => res.status(400).json({ error }));

          }else if(sauce.usersDisliked.includes(userId)){
            Sauce.updateOne({_id: id}, {$pull: {usersDisliked : userId}, $inc : {dislikes : -1}})
              .then(()=>res.status(200).json({message:"id enlevé du tableau userDisLiked"}))
              .catch(error => res.status(400).json({ error }));   
          }  
        })
        .catch(error => res.status(400).json({ error }));
    }
  }