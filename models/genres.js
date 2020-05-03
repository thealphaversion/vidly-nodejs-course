const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateRequest(genre) {
    const schema = {
        title: Joi.string().min(3).max(50).required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateRequest = validateRequest;
exports.genreSchema = genreSchema;