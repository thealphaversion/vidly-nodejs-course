const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (request, response) => {
    let result = validate(request.body)
    if(result.error) {
        response.status(400).send(result.error.details[0].message);
        return;
    }

    let user = await User.findOne({ email: request.body.email });
    if (!user) {
        return response.status(400).send('Invalid email or password.');
    }

    const validPassword = await bcrypt.compare(request.body.password, user.password);
    if (!validPassword) {
        return response.status(400).send('Invalid email or password.');
    }

    // const token = jwt.sign({ _id: URLSearchParams._id }, 'privatekey');
    const token = user.generateAuthToken();

    response.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(2048).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;