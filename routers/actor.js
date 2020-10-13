let mongoose = require('mongoose');


let Actor = require('../models/actor');
let Movie = require('../models/movie');

module.exports = {
    getAll: function (req, res) {
        Actor.find({})
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
//2.Delete an actor and all its movies
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, 
            function(err,actor){
                let movies = actor.movies;
                Movie.deleteMany({_id:{$in:movies}},
            function (err) {
            if (err) {return res.status(400).json(err);}
            res.json();
            })})
    },

    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },

//3.Remove a movie from the list of movies of an actor
    removeMovie:function(req,res){
        Actor.findById({_id: req.params.id},function(err,actor){
            if(err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
        Movie.findOne({_id: req.params.movieId},function(err,movie){
            if(err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            
            let newMovies = actor.movies.filter(function(movies){
                if(movies.toString() === req.params.movieId){
                    return false;
                }else{
                    return true;
                }
            })
            actor.movies = newMovies;
            actor.save(function(err){
            if(err) return res.status(500).json(err);
            res.json(actor);
            })
        }
        )
        }
        )
    },
//extra task
getActorsByAge:function(req,res){
    let c = new Date();
    let currentYear=c.getFullYear();
    let miniAge =  parseInt(req.query.miniAge);
    let maxAge =  parseInt(req.query.maxAge);
    let miniYear = currentYear-maxAge;
    let maxYear = currentYear-miniAge;

    if(maxAge > miniAge){
        Actor.find({bYear:{$lte:maxYear,$gte:miniYear}},function (err) {
         if (err) return res.status(400).json(err);
         res.json();
     });
    }else {
     return res.status(400).json('max age should greater than mini age')
    }
}

};