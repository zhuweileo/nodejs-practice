const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(11111);
    res.end('shoudao')
});

server.listen(8000);