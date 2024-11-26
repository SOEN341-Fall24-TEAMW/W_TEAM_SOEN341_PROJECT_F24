const fs = require('fs');
const { Parser } = require('json2csv');

// Mock data for the database
const mockDb = {
    organizations: [
        { id: 'org1', name: 'Organization One' },
        { id: 'org2', name: 'Organization Two' },
    ],
    users: [
        { id: 's1', email: 'student1@example.com', name: 'Student One', password: 'pass1', organization_id: 'org1' },
        { id: 's2', email: 'student2@example.com', name: 'Student Two', password: 'pass2', organization_id: 'org1' },
    ],
};

// Mock database and supporting functions
let mockUsers = mockDb.users; // Default mock data

beforeEach(() => {
    // Reset the mock db before each test
    global.db = {
        get: jest.fn((collection) => {
            const data = {
                organizations: mockDb.organizations,
                users: mockUsers,
            };
            return {
                value: () => data[collection],
            };
        }),
    };
    // Clear all mocks to ensure test isolation
    jest.clearAllMocks();
});

// Mock json2csv parser
jest.mock('json2csv', () => {
    const originalModule = jest.requireActual('json2csv');
    return {
        ...originalModule,
        Parser: jest.fn(() => ({
            parse: jest.fn((data) => `csv-data-for-${data.length}-students`), // Mocked CSV output
        })),
    };
});

// Mock fs.writeFileSync
jest.mock('fs', () => ({
    writeFileSync: jest.fn(),
}));

// Implementation of the function to test
function fetchStudentsByOrganization(orgId) {
    return db.get("users")
        .value()
        .filter(user => user.organization_id === orgId)
        .map(student => ({
            id: student.id,
            email: student.email,
            password: student.password,
            name: student.name,
        }));
}

function exportAllOrganizationStudentsToCSV() {
    const organizations = db.get("organizations").value();
    const csvFiles = [];

    const json2csvParser = new Parser();

    organizations.forEach((org) => {
        const students = fetchStudentsByOrganization(org.id);

        if (students.length > 0) {
            const csvData = json2csvParser.parse(students);

            const filename = `students_${org.name.replace(/ /g, "_").toLowerCase()}.csv`;
            fs.writeFileSync(filename, csvData);
            csvFiles.push(filename);
            console.log(`CSV file ${filename} created successfully for organization: ${org.name}`);
        }
    });
    return csvFiles;
}

// Test suite
describe('exportAllOrganizationStudentsToCSV', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create CSV files for organizations with students', () => {
        const result = exportAllOrganizationStudentsToCSV();

        expect(result).toEqual([
            'students_organization_one.csv',
        ]);

        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            'students_organization_one.csv',
            'csv-data-for-2-students'
        );
    });

    it('should not create CSV files for organizations without students', () => {
        mockUsers = []; // Return an empty array for users

        const result = exportAllOrganizationStudentsToCSV();

        expect(result).toEqual([]); // No files should be created
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
});
