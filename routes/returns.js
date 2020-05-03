const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    let result = validateReturn(req.body)
    if(result.error) {
        return  res.status(400).send(result.error.details[0].message);
    }

    /*
    if(!req.body.customerId) {
        return res.status(400).send('customerId not provided');
    }
    if(!req.body.movieId) { 
        return res.status(400).send('movieId not provided');
    }
    */

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) {
        return res.status(404).send('Rental not found.');
    }

    if(rental.dateReturned) {
        return res.status(400).send('Return already processed.');
    }

    rental.return();
    await rental.save();

    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);
});

function validateReturn(request) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(genre, schema);
}

module.exports = router;