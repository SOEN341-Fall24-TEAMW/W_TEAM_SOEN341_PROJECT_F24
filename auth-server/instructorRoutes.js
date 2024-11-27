// instructorRoutes.js

const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const db = require('./database'); // Assuming you have a database instance set up

// Export data for all organizations
router.get('/export/all', async (req, res) => {
    try {
        const organizations = db.get("organizations").value();
        let csvFiles = {};

        const json2csvParser = new Parser({
            fields: ['name', 'studentId', 'email', 'team', 'course', 'organization']
        });

        organizations.forEach(org => {
            const studentData = db.get("users")
                .filter({ role: 'student', organization_id: org.id })
                .map(student => ({
                    name: student.name || "No name",
                    studentId: student.id || "No ID",
                    email: student.email || "No email",
                    team: db.get("teams").find({ id: student.team_id }).get("name").value() || "No team",
                    course: db.get("courses").find({ id: student.course_id }).get("name").value() || "No course",
                    organization: db.get("organizations").find({ id: student.organization_id }).get("name").value() || "No organization"
                }))
                .value();

            if (studentData.length > 0) {
                const csvData = json2csvParser.parse(studentData);
                csvFiles[org.name] = csvData;
            }
        });

        // Return the CSV data as a JSON object where keys are organization names
        res.status(200).json(csvFiles);

    } catch (error) {
        console.error("Error exporting CSV data for all organizations:", error);
        res.status(500).json({ message: "Error exporting data", error });
    }
});

module.exports = router;

