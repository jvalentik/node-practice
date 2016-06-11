'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimeTypes = {
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.gif': 'image/gif',
    '.png': 'image/png',
    '.jpeg': 'image/jpeg'
}

function webServer(req, res) {
    let baseURI = url.parse(req.url, true);
    let filePath = __dirname + (baseURI.pathname === '/' ? '/public/index.htm' :'/public/' + baseURI.pathname);
    fs.access(filePath, fs.F_OK, error => {
        if(!error) {
            console.log('Serving: ' + filePath);
            fs.readFile(filePath, (error, content) => {
                if(!error) {
                    let contentType = mimeTypes[path.extname(filePath)];
                    res.writeHead(200, {'Content-type': contentType});
                    res.end(content, 'utf-8');
                }
                else {
                    res.writeHead(500);
                    res.end('The server could not read file');
                }
            });
        }
        else {
            res.writeHead(404, {'Content-type': 'text/html'});
            res.end('Content not found');
        }
    });
}

http.createServer(webServer).listen(3000, () => {
    console.log('Server running on port 3000');
});
