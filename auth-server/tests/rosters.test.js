const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const db = {
    rosters: [],
    get(collection) {
        return {
            push(item) {
                db[collection].push(item);
                return this;
            },
            write() {
                // Simulate a write operation (no-op since we're using an in-memory array)
                return this;
            }
        };
    }
};

app.post('/rosters', (req, res) => {
    const { teamID, courseName } = req.body;

    const newRoster = {
        rosterID: uuidv4(),
        teamID,
        courseName
    };

    db.get('rosters').push(newRoster).write(); // Store the roster in the database
    res.status(201).send(newRoster); // Send the created roster as a response
});

describe('POST /rosters', () => {
    test('should create a new roster when valid data is provided', async () => {
        const response = await request(app)
            .post('/rosters')
            .send({
                teamID: 'team123',
                courseName: 'Software Engineering'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('rosterID');
        expect(response.body.teamID).toBe('team123');
        expect(response.body.courseName).toBe('Software Engineering');
    });

    test('should return 201 even if optional fields are missing', async () => {
        const response = await request(app)
            .post('/rosters')
            .send({
                teamID: 'team456',
                courseName: ''
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('rosterID');
        expect(response.body.teamID).toBe('team456');
        expect(response.body.courseName).toBe('');
    });
});
