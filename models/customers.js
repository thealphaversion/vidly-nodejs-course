const mongoose = require('mongoose');
const Joi = require('joi');

function validateRequest(customer) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(3).max(50).required()
    };

    return Joi.validate(customer, schema);
}

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
}));

exports.Customer = Customer;
exports.validateRequest = validateRequest;