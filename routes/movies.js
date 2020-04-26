const express = require('express');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genres');

const router = express.Router();

router.get('/', async (request, response) => {
    const movies = await Movie.find().sort('title');
    response.send(movies);
});

router.post('/', async (request, response) => {
    let result = validateMovie(request.body)
    if (result.error) {
        response.status(400).send(result.error.details[0].message);
        return;
    }

    const genre = await Genre.findById(req.body.genreId);

    if (!genre) {
        response.status(400).send("Invalid genre.");
        return;
    }

    const movie = new Movie({
        title: request.body.title,
        genre: {
            _id: genre._id,
            title: genre.title
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    // movie = await movie.save();         // since mongodb driver sets objectid, and not mongodb
                                           // we no longer need to do this
    // instead we can just do 
    await movie.save();
    // and change movie back to a constant
    
    response.send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validateMovie(request.body);
    console.log(error);
    if(error) {
        // 400 => Bad Request
        response.status(400).send(error.details[0].message);
        return;
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title }, {new: true});
    
    if(!movie) {
        response.status(404).send("404: Genre not found!");
        return;
    }

    res.send(movie);
});

router.delete('/:id', async (request, response) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) {
        response.status(404).send("404: Genre not found!");
        return;
    }
    response.send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) {
        response.status(404).send("404: Genre not found!");
        return;
    }
    response.send(movie);
});

module.exports = router;