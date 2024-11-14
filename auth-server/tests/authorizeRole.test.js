const express = require('express');
const request = require('supertest');
const { authorizeRole } = require('../app'); 

// Create a mock Express app
const app = express();

// Middleware to mock `req.user` with the correct role
app.use((req, res, next) => {
    req.user = { role: 'admin' }; // Set a mock user with the 'admin' role
    next();
});


app.get('/test-route', authorizeRole('admin'), (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});

describe('authorizeRole Middleware - Simple Test', () => {
    it('should grant access to a route for the correct role', async () => {
        const response = await request(app).get('/test-route');
        expect(response.status).toBe(200); // Ensure the response status is 200
        expect(response.body.message).toBe('Access granted'); // Ensure the response message matches
    });
});
