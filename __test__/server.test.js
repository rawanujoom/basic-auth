'use strict';

const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

describe('API',()=>{
    it('POST to /signup to create a new user', async ()=>{
        let obj = {
            username : "Ahmad",
            password :"123"
        }
        let data = await mockRequest.post('/signup').send(obj);
        expect(data.status).toBe(200);
    });
    it('POST to /signin to login as a user (use basic auth)', async ()=>{
        let obj = {
            username : "Ahmad",
            password :"123"
        }
        let data = await mockRequest.post('/signup').send(obj);
        expect(data.status).toBe(200);
    })
});