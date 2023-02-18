const fs = require('fs'),
	app = require('express')(),
	cors = require('cors'),
	http = require('http'),
	routes = require('./routes/index'),
	PORT = require ('./constants').PORT;

// app / server
app.use(cors());

app.use(routes);

const server = http.createServer(app),
	{ Server } = require('socket.io'),
	io = new Server(server,{cors:{
		origin:'*'
	}});

// file operations
fs.mkdirSync('./downloaded', { recursive: true });

io.on('connection', (socket) => {
	console.log('a user connected');

	process.on('download-finished', (name)=>{
		io.emit('download-finished-io', name)
	})
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
