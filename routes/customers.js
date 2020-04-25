const express = require('express');
const mongoose = require('mongoose');
const {Customer, validateRequest} = require('../models/customers');

const router = express.Router();

// we are not defining the customer object here because every module should have one responsibility
// so we move the customer model to the models directory

router.get('/', async (request, response) => {
    const customers = await Customer.find().sort('title');
    response.send(customers);
});

router.post('/', async (request, response) => {
    let result = validateRequest(request.body)
    if(result.error) {
        response.status(400).send(result.error.details[0].message);
        return;
    }

    let customer = new Customer({
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    });

    customer = await customer.save();
    response.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateRequest(request.body);
    console.log(error);
    if(error) {
        // 400 => Bad Request
        response.status(400).send(error.details[0].message);
        return;
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    },
    {
        new: true
    });
    
    if(!customer) {
        response.status(404).send("404: Customer not found!");
        return;
    }

    res.send(customers);
});

router.delete('/:id', async (request, response) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) {
        response.status(404).send("404: Customer not found!");
        return;
    }
    response.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) {
        response.status(404).send("404: Customer not found!");
        return;
    }
    response.send(customer);
});

module.exports = router;