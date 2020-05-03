const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const {User, validateUser} = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select({ password: -1 });
    res.send(user);
});

router.post('/', async (request, response) => {
    let result = validateUser(request.body)
    if(result.error) {
        response.status(400).send(result.error.details[0].message);
        return;
    }

    let user = await User.findOne({ email: request.body.email });

    if (user) {
        return response.status(400).send('User already registered.');
    }

    /*
    user = new User({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password
    });
    */

    user = new User(_.pick(request.body, ['name', 'email', 'password']));       // this way we would only store those properties that we want
                                                                                // and no malicious user can send random properties to be stored
    const salt = await bcrypt.genSalt(10);              // the argument is the number of the rounds we intend to run the algorithm to generate the salt
                                                        // the higher the the number, the longer it is going to take to generate the salt
                                                        // and the salt will be more complex and harder to break
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();

    const token = user.generateAuthToken();
    response.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
});

module.exports = router;