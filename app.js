const fs = require('fs');

// let ngnix know we want to start serving from the proxy
fs.openSync('/tmp/app-initialized', 'w');

const server = require('http').createServer(function (req, res) {
    res.writeHead(200);
    res.end('hello world');
});

// socket.io setup
const io = require('socket.io').listen(server);
io.set('transports', ['websocket']);

// listen to ngnix socket
server.listen('/tmp/nginx.socket', function () {
    console.info(`server up`);
});

io.on('connect_error', function (err) {
    console.error(err);
});

io.on('connect_timeout', function (err) {
    console.error(err);
});

io.on('connection', function (socket) {
    console.info(`socket: ${socket.id} connected`);

    socket.on('disconnect', function () {
        console.info('disconnected');
    });

    socket.on('login', message => {
        socket.emit('login', {message: message});
    })
});
