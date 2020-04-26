const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customers');
const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const router = express.Router();
Fawn.init(mongoose);

router.get('/', async (request, response) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    response.send(rentals);
});

router.post('/', async (request, response) => {
    let result = validateRental(request.body)
    if (result.error) {
        response.status(400).send(result.error.details[0].message);
        return;
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
        response.status(400).send("Invalid customer.");
        return;
    }

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
        response.status(400).send("Invalid movie.");
        return;
    }

    if (movie.numberInStock === 0) {
        return response.status(400).send("Movie not in stock.")
    }

    let rental = new Rental({
        customer: { 
            _id: customer._id,                  // we store _id so that if we ever need to query the customers collection, then we can do so using _id and get more data
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,                     // we store _id so that if we ever need to query the movies collection, then we can do so using _id and get more data
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    /*
    rental = await rental.save();

    movie.numberInStock = movie.numberInStock - 1;
    movie.save();

    // there are two save() operations hers
    // there may be a case when the first one completes and then second one fails,
    // so we need transactions here
    // transactions give the property of atomicity to the operations
    // either both of them complete, or none of them do

    // now mongodb doesn't have transactions as we have in relational databases
    // there is a concept in mongo db called two phase commits

    // however, here we use an npm package that simulates transactions for us
    // internally it uses the concept of two phase commits

    */

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
    } catch (ex) {
        res.status(500).send("Failure..."); 
    }

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