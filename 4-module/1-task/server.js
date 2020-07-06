const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      fs.readFile(filepath, (err, data) => {
        console.log(filepath);
        if (err) {
          if (err.code === 'ENOENT') {
            const match = pathname.match(/\//g);

            if (match && match.length >= 1) {
              res.statusCode = 400;
              res.end('Subfolder Not Support');
            } else {
              res.statusCode = 404;
              res.end('Not Found');
            }
          } else {
            res.statusCode = 500;
            res.end('Error');
          }
        } else {
          res.statusCode = 200;
          res.end(data);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
