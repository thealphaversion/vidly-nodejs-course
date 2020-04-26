const express = require('express');
const {Genre, validateRequest} = require('../models/genres');

const router = express.Router();

router.get('/', async (request, response) => {
    const genres = await Genre.find().sort('title');
    response.send(genres);
});

router.post('/', async (request, response) => {
    let result = validateRequest(request.body)
    if(result.error) {
        response.status(400).send(result.error.details[0].message);
        return;
    }

    let genre = new Genre({ title: request.body.title });

    genre = await genre.save();
    response.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validateRequest(request.body);
    console.log(error);
    if(error) {
        // 400 => Bad Request
        response.status(400).send(error.details[0].message);
        return;
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id, { title: req.body.title }, {new: true});
    
    if(!genre) {
        response.status(404).send("404: Genre not found!");
        return;
    }

    res.send(genre);
});

router.delete('/:id', async (request, response) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) {
        response.status(404).send("404: Genre not found!");
        return;
    }
    response.send(genre);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) {
        response.status(404).send("404: Genre not found!");
        return;
    }
    response.send(genre);
});

module.exports = router;