const express = require('express');
const router = express.Router();

const genres = [{id: 1, title: "Thriller"}, {id: 2, title: "Comedy"}, {id: 3, title: "Adventure"}];

function validateRequest(genre) {
    const schema = {
        title: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

router.get('/', (request, response) => {
    // response.render('index', {title: 'Vidly', message: 'Hello'});
    response.send(genres);
});

router.post('/', (request, response) => {
    let result = validateRequest(request.body)
    if(result.error) {
        response.status(400).send(result.error.details[0].message);
        return;
    }

    const genre = {
        id: genres.length + 1,
        title: request.body.title
    }

    genres.push(genre);
    response.send(genres);
});

router.put('/:id', (req, res) => {
    let genre = genres.find(g => g.id === parseInt(request.params.id));
    if(!genre) {
        response.status(404).send("404: Genre not found!");
        return;
    }

    const { error } = validateRequest(request.body);
    console.log(error);
    if(error) {
        // 400 => Bad Request
        response.status(400).send(error.details[0].message);
        return;
    }

    genre.title = req.body.id;
    res.send(genres);
});

router.delete('/:id', (request, response) => {
    let genre = genres.find(g => g.id === parseInt(request.params.id));
    if(!genre) {
        response.status(404).send("404: Course not found!");
        return;
    }

    // first we have to find the index of the genre we want to remove
    let index = genres.indexOf(course);

    // then we use the splice method to delete the genre
    genres.splice(index, 1);
    
    // Return the genre
    response.send(genre);
});

module.exports = router;