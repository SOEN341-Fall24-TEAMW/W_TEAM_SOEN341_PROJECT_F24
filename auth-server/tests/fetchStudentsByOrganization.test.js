const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');

// Copy the function to be tested
function fetchStudentsByOrganization(db, orgId) {
    return db.get("users")
        .filter({ role: 'student', organization_id: orgId })
        .map(student => ({
            id: student.id,
            email: student.email,
            password: student.password,
            name: student.name
        }))
        .value();
}

describe('fetchStudentsByOrganization', () => {
    let db;

    beforeEach(() => {
        // Initialize an in-memory database
        const adapter = new Memory();
        db = low(adapter);

        // Populate the mock database
        db.defaults({
            users: [
                { id: "s1", email: "student1@example.com", password: "pass1", name: "Student 1", role: "student", organization_id: "org1" },
                { id: "s2", email: "student2@example.com", password: "pass2", name: "Student 2", role: "student", organization_id: "org2" },
                { id: "s3", email: "student3@example.com", password: "pass3", name: "Student 3", role: "student", organization_id: "org1" },
                { id: "t1", email: "teacher1@example.com", password: "pass4", name: "Teacher 1", role: "instructor", organization_id: "org1" },
            ],
        }).write();
    });

    it('should return students for the specified organization ID', () => {
        const orgId = "org1";
        const students = fetchStudentsByOrganization(db, orgId);

        expect(students).toEqual([
            { id: "s1", email: "student1@example.com", password: "pass1", name: "Student 1" },
            { id: "s3", email: "student3@example.com", password: "pass3", name: "Student 3" },
        ]);
    });

    it('should return an empty array if no students are found for the specified organization ID', () => {
        const orgId = "org3"; // Non-existent organization
        const students = fetchStudentsByOrganization(db, orgId);

        expect(students).toEqual([]);
    });

    it('should return an empty array if there are no users in the database', () => {
        db.set("users", []).write(); // Clear the users collection

        const orgId = "org1";
        const students = fetchStudentsByOrganization(db, orgId);

        expect(students).toEqual([]);
    });
});
