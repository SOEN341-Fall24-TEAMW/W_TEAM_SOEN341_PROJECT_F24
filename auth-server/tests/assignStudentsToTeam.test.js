// Define the function directly in the test file
function assignStudentsToTeams(students, teams) {
    const assignments = {};

    if (teams.length === 0) {
        return assignments; // Return an empty object if there are no teams
    }

    // Initialize all teams with empty arrays
    teams.forEach((team) => {
        assignments[team] = [];
    });

    let teamIndex = 0;

    students.forEach((student) => {
        const team = teams[teamIndex];
        if (!assignments[team]) assignments[team] = [];
        assignments[team].push(student);
        teamIndex = (teamIndex + 1) % teams.length;
    });

    return assignments;
}

describe("assignStudentsToTeams", () => {
    test("should evenly distribute students across teams", () => {
        const students = ["Alice", "Bob", "Charlie", "Diana"];
        const teams = ["Team1", "Team2"];

        const result = assignStudentsToTeams(students, teams);

        expect(result).toEqual({
            Team1: ["Alice", "Charlie"],
            Team2: ["Bob", "Diana"],
        });
    });

    test("should handle empty students array", () => {
        const students = [];
        const teams = ["Team1", "Team2"];

        const result = assignStudentsToTeams(students, teams);

        expect(result).toEqual({
            Team1: [],
            Team2: [],
        });
    });

    test("should handle empty teams array", () => {
        const students = ["Alice", "Bob"];
        const teams = [];

        const result = assignStudentsToTeams(students, teams);

        expect(result).toEqual({}); // Expect an empty object
    });

    test("should handle more teams than students", () => {
        const students = ["Alice"];
        const teams = ["Team1", "Team2", "Team3"];

        const result = assignStudentsToTeams(students, teams);

        expect(result).toEqual({
            Team1: ["Alice"],
            Team2: [],
            Team3: [],
        });
    });
});
