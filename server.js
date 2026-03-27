const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HTML_FILE = path.join(__dirname, 'capacity_dashboard.html');
const DATA_FILE = path.join(__dirname, 'data.csv');

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) { res.writeHead(500); res.end('Error'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });

  } else if (req.method === 'GET' && req.url === '/api/data') {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) { res.writeHead(404); res.end(''); return; }
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(data);
    });

  } else if (req.method === 'POST' && req.url === '/api/upload') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      fs.writeFile(DATA_FILE, body, err => {
        if (err) { res.writeHead(500); res.end('Error saving'); return; }
        res.writeHead(200); res.end('OK');
      });
    });

  } else {
    res.writeHead(404); res.end('Not found');
  }

}).listen(PORT, () => console.log(`Capacity Dashboard running on port ${PORT}`));
