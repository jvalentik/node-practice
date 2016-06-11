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

function fileAccess(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, error => {
            if (!error) {
                resolve(filePath);
            }
            else {
                reject(error);
            }
        });
    });
}

function fileReader(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, content) => {
            if(!error) {
                resolve(content);
            }
            else {
                reject(error);
            }
        });
    });
}

function webServer(req, res) {
    let baseURI = url.parse(req.url, true);
    let filePath = __dirname + (baseURI.pathname === '/' ? '/public/index.htm' : '/public/' + baseURI.pathname);
    let contentType = mimeTypes[path.extname(filePath)];

    fileAccess(filePath)
        .then(fileReader)
        .then(content => {
            res.writeHead(200, {'Content-type': contentType});
            res.end(content, 'utf-8');
        })
        .catch(error => {
            res.writeHead(404);
            res.end(JSON.stringify(error));
        });

}

http.createServer(webServer).listen(3000, () => console.log('Server running on port 3000'));
