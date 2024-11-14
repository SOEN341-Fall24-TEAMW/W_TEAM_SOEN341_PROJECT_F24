const http = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');

describe('Socket.IO Basic Tests', () => {
    let ioServer, httpServer, clientSocket;

    beforeAll((done) => {
        // Create and set up HTTP server with Socket.IO
        httpServer = http.createServer();
        ioServer = new Server(httpServer);

        ioServer.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });

        // Start the server
        httpServer.listen(3081, done);
    });

    afterAll((done) => {
        // Gracefully close the server and socket.io
        ioServer.close();
        httpServer.close(done);
    });

    test('should successfully connect and disconnect', (done) => {
        // Connect client to the server
        clientSocket = ioClient('http://localhost:3081');

        clientSocket.on('connect', () => {
            console.log('Client connected');
            expect(clientSocket.connected).toBe(true);

            // Disconnect client
            clientSocket.disconnect();
        });

        clientSocket.on('disconnect', () => {
            console.log('Client disconnected');
            expect(clientSocket.connected).toBe(false);
            done();
        });
    });
});
