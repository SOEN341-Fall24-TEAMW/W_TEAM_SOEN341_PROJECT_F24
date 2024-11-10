const express = require('express');
const router = express.Router();
const { isInstructor } = require('./middleware'); // Assuming this checks the instructor role
const { Parser } = require('json2csv');
const db = require('./database'); // Your database instance

// Route to export student data
router.get('/export', isInstructor, (req, res) => {
    const organizationId = req.query.organizationId;

    if (!organizationId) {
        return res.status(400).json({ message: "Organization ID is required" });
    }

    // Fetch data for the specified organization
    const studentData = db.get("users")
        .filter({ role: 'student', organization_id: organizationId })
        .map(student => ({
            name: student.name || "No name",
            studentId: student.id || "No ID",
            email: student.email || "No email",
            team: db.get("teams").find({ id: student.team_id }).get("name").value() || "No team",
            course: db.get("courses").find({ id: student.course_id }).get("name").value() || "No course",
            organization: db.get("organizations").find({ id: student.organization_id }).get("name").value() || "No organization"
        }))
        .value();

    if (studentData.length === 0) {
        return res.status(404).json({ message: "No students found for this organization" });
    }

    // Define CSV fields and parse data
    const fields = ['name', 'studentId', 'email', 'team', 'course', 'organization'];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(studentData);

    // Set the headers and send the CSV content
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_${organizationId}.csv`);
    res.status(200).send(csvData);
});

module.exports = router;
