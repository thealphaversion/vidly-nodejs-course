const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genres');
const request = require('supertest');

describe('auth middleware', () => {
    let server;
    let token;

    beforeEach(() => {
        server = require('../../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    });

    const exec = () => {
        return request(server).post('/api/genres').set('x-auth-token', token).send({ title: 'genre1' });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});

// with the supertest module, we cannot access the request object
// so we must write a unit test to test it