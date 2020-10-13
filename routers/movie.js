let Actor = require('../models/actor');
let Movie = require('../models/movie');

let mongoose = require('mongoose');


module.exports = {
    getAll: function (req, res) {
        Movie.find({})
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    //1.Delete a movie by its ID
    deleteOne: function (req, res) {
        Movie.findByIdAndDelete({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
//4.Remove an actor from the list of actors in a movie
    removeActor:function(req,res){
    Movie.findById({_id: req.params.id},function(err,movie){
        if(err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();
    Actor.findOne({_id: req.params.actorId},function(err,actor){
        if(err) return res.status(400).json(err);
        if (!actor) return res.status(404).json();
        
        let newActor = movie.actors.filter(function(actors){
            if(actors.toString() === req.params.actorId){
                return false;
            }else{
                return true;
            }
        })
        movie.actors = newActor;
        movie.save(function(err){
        if(err) return res.status(500).json(err);
        res.json(movie);
        })
    }
    )
    }
    )
    },
//5.Add an existing actor to the list of actors in a movie
    addActor: function (req, res) {
    Movie.findOne({ _id: req.params.id }, function (err, movie) {
        if (err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();
        Actor.findOne({ _id: req.body.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            movie.actors.push(actor._id);
            movie.save(function (err) {
                if (err) return res.status(500).json(err);
                res.json(actor);
            });
        })
    });
    },

//6.Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.
getMoviesBetweenYears: function(req,res){
    let year1 = req.params.year1;
    let year2 = req.params.year2;
     if(year1 > year2){
         Movie.find({year:{$lte:year1,$gte:year2}}).exec(function (err, movie) {
             if (err) return res.status(400).json(err);
             if (!movie) return res.status(404).json();
             res.json(movie);
    })
}else{
    return res.status(400).json('Year 1 should greater than year 2')
}
   },
//9.Delete all the movies that are produced between two years. 
   deleteMoviesBetweenYears:function(req,res){
       let year1 =  parseInt(req.body.year1);
       let year2 =  parseInt(req.body.year2);
       if(year1 > year2){
           Movie.deleteMany({year:{$lte:year1,$gte:year2}},function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
       }else {
        return res.status(400).json('Year 1 should greater than year 2')
       }
   }
    
};