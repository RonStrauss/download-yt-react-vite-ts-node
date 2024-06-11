const fs = require('fs');
const app = require('express')();
const cors = require('cors');
const http = require('http');

// file operations, prepare before requiring routes
fs.mkdirSync('./downloaded', { recursive: true });

const routes = require('./routes/index');
const PORT = require('./constants').PORT;


// app / server
app.use(cors());

app.use(routes);

const server = http.createServer(app),
	{ Server } = require('socket.io'),
	io = new Server(server, {
		cors: {
			origin: '*'
		}
	});


io.on('connection', (socket) => {
	console.log('a user connected');

	process.on('download-finished', (name) => {
		io.emit('download-finished-io', name)
	})
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
