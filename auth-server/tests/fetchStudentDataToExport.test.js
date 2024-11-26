// Mock the fetchStudentDataToExport function
function fetchStudentDataToExport(organizationId, db) {
    return db.users
        .filter(user => user.role === 'student' && user.organization_id === organizationId)
        .map(student => ({
            name: student.name || "No name",
            studentId: student.id || "No ID",
            email: student.email || "No email",
            team: db.teams.find(team => team.id === student.team_id)?.name || "No team",
            course: db.courses.find(course => course.id === student.course_id)?.name || "No course",
            organization: db.organizations.find(org => org.id === student.organization_id)?.name || "No organization",
        }));
}

// Test data
const mockDb = {
    users: [
        { id: "s1", name: "Student 1", email: "student1@example.com", role: "student", organization_id: "org1", team_id: "t1", course_id: "c1" },
        { id: "s2", name: "Student 2", email: "student2@example.com", role: "student", organization_id: "org1", team_id: "t2", course_id: "c2" },
        { id: "i1", name: "Instructor 1", email: "instructor1@example.com", role: "instructor", organization_id: "org1" },
    ],
    teams: [
        { id: "t1", name: "Team 1" },
        { id: "t2", name: "Team 2" },
    ],
    courses: [
        { id: "c1", name: "Course 1" },
        { id: "c2", name: "Course 2" },
    ],
    organizations: [
        { id: "org1", name: "Organization 1" },
    ],
};

// Test suite
describe("fetchStudentDataToExport", () => {
    test("should fetch data for students in the specified organization", () => {
        const result = fetchStudentDataToExport("org1", mockDb);

        expect(result).toHaveLength(2);

        expect(result[0]).toEqual({
            name: "Student 1",
            studentId: "s1",
            email: "student1@example.com",
            team: "Team 1",
            course: "Course 1",
            organization: "Organization 1",
        });

        expect(result[1]).toEqual({
            name: "Student 2",
            studentId: "s2",
            email: "student2@example.com",
            team: "Team 2",
            course: "Course 2",
            organization: "Organization 1",
        });
    });

    test("should return an empty array if no students are in the organization", () => {
        const result = fetchStudentDataToExport("org2", mockDb);
        expect(result).toEqual([]);
    });

    test("should handle missing fields gracefully", () => {
        const extendedDb = {
            ...mockDb,
            users: [
                ...mockDb.users,
                { id: "s3", role: "student", organization_id: "org1" }, // Missing fields
            ],
        };

        const result = fetchStudentDataToExport("org1", extendedDb);

        expect(result.find(student => student.studentId === "s3")).toEqual({
            name: "No name",
            studentId: "s3",
            email: "No email",
            team: "No team",
            course: "No course",
            organization: "Organization 1",
        });
    });
});
