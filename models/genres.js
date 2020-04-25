const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
}));

function validateRequest(genre) {
    const schema = {
        title: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateRequest = validateRequest;