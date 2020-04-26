const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genres');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 300
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 199
    }
}));

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };

    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;