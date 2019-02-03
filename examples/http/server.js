const http = require('http');

const r = require('./router');

r.on('GET', '/a/b', (req, res) => {
  res.end('hello world');
});

r.on('GET', '/u/:id', (req, res) => {
  res.end(`hello user id ${req.params.id}`);
});

const server = http.createServer((req, res) => {
  r.lookup(req, res)
})

server.listen(3000, err => {
  if (err) throw err
  console.log('Server listening on: http://localost:3000')
});
