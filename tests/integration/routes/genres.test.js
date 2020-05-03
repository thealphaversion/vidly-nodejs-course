const request = require('supertest');
const { Genre } = require('../../../models/genres');
const { User } = require('../../../models/user');
let server;

describe('/api/genres', () => {
    beforeEach(async () => { server = require('../../../index'); });
    afterEach(async () => {
        await server.close();
        // whenever we make changes to a db, we should always cleanup afterwards
        await Genre.remove({});           // this will remove all genres
    });
    
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { title: 'genre1' },
                { title: 'genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.title === "genre1")).toBeTruthy();
            expect(res.body.some(g => g.title === "genre2")).toBeTruthy();
        });
    });
    
    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ title: 'genre1' });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', genre.title);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });
    
    describe('POST /', () => {
        // Since there is a lot of repeating code in all the tests with small variations,
        // we are gonna use Mosh's refactoring technique

        // The idea is to define the hppy path, and then in each test case
        // we change one parameter that clearly aligns with the name of the test.
        
        let token;
        let title;

        // happy path
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ title: title });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            title = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 3 characters', async () => {
            // we will have to pass auth token as well
            title = '12';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            // we will have to pass auth token as well
            title = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save genre if it is valid', async () => {
            await exec();

            const genre = await Genre.find({ title: 'genre1'  });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', 'genre1');
        });
    });
});