let bodyParser = require('body-parser');
let express = require('express');
let mongoose = require('mongoose');
let path = require("path");

let actors = require('./routers/actor');
let movies = require('./routers/movie');
let app = express();

app.listen(8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "dist/movieAng")));

mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});
//Configuring Endpoints

//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
//2.Delete an actor and all its movies
app.delete('/actors/:id', actors.deleteOne);
//3.Remove a movie from the list of movies of an actor
app.delete('/actors/:id/:movieId', actors.removeMovie);


//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);

//1.Delete a movie by its ID
app.delete('/movies/:id', movies.deleteOne);

//4.Remove an actor from the list of actors in a movie
app.delete('/movies/:id/:actorId',movies.removeActor);

//5.Add an existing actor to the list of actors in a movie
app.post('/movies/:id/actors', movies.addActor);

//6.Retrieve (GET) all the movies produced between year1 and year2, where year1>year2.
app.get('/movies/:year1/:year2',movies.getMoviesBetweenYears);

//9.Delete all the movies that are produced between two years. 
app.delete('/movies',movies.deleteMoviesBetweenYears);