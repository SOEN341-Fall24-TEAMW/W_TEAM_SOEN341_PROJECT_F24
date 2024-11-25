const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock database
const mockDb = {
    teams: [
        { id: 'team1', name: 'Team Alpha', course_id: 'course1' },
        { id: 'team2', name: 'Team Beta', course_id: 'course1' },
    ],
    peer_evaluations: [
        { team_id: 'team1', evaluator_id: 'student1' },
        { team_id: 'team1', evaluator_id: 'student2' },
        { team_id: 'team2', evaluator_id: 'student3' },
    ],
    team_memberships: [
        { team_id: 'team1', student_id: 'student1' },
        { team_id: 'team1', student_id: 'student2' },
        { team_id: 'team1', student_id: 'student3' },
        { team_id: 'team2', student_id: 'student3' },
        { team_id: 'team2', student_id: 'student4' },
    ],
    get(collection) {
        const data = this[collection];
        return {
            filter: (predicate) => ({
                map: (mapper) => ({
                    value: () => data.filter(predicate).map(mapper),
                }),
                value: () => data.filter(predicate),
            }),
            value: () => data,
        };
    },
};

// Mock Express app
const app = express();
app.use(bodyParser.json());

// Endpoint implementation
app.post('/get-feedback-records', (req, res) => {
    const course = req.body.course;
    console.log("Course received:", course);
    const results = [];

    try {
        const teams = mockDb.get('teams')
            .filter((team) => course.id.includes(team.course_id))
            .value();

        teams.forEach((team) => {
            const unique_evaluators = new Set(
                mockDb.get('peer_evaluations')
                    .filter(evaluation => evaluation.team_id === team.id)
                    .map(evaluation => evaluation.evaluator_id)
                    .value()
            );

            const team_size = new Set(
                mockDb.get('team_memberships')
                    .filter(membership => membership.team_id === team.id)
                    .map(membership => membership.student_id)
                    .value()
            ).size;

            results.push({ name: team.name, size: team_size, numberOfFeedbacks: unique_evaluators.size });
        });

        res.status(200).json({ message: 'success', results });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Invalid input", error });
    }
});

// Tests
describe('POST /get-feedback-records', () => {
    it('should return feedback records for teams in a given course', async () => {
        const response = await request(app)
            .post('/get-feedback-records')
            .send({ course: { id: ['course1'] } });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
        expect(response.body.results).toEqual([
            { name: 'Team Alpha', size: 3, numberOfFeedbacks: 2 },
            { name: 'Team Beta', size: 2, numberOfFeedbacks: 1 },
        ]);
    });

    it('should return an empty array if the course has no teams', async () => {
        const response = await request(app)
            .post('/get-feedback-records')
            .send({ course: { id: ['nonexistent_course'] } });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
        expect(response.body.results).toEqual([]);
    });

    it('should return 500 for invalid input', async () => {
        const response = await request(app)
            .post('/get-feedback-records')
            .send({});

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Invalid input");
    });
});
