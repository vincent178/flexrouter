var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const s = 'abcdefghijklmnopqrstuvwxyz';

const buildRandomRoute = () => {
  const len = Math.floor(Math.random() * 20);
  return Array.from(new Array(len)).reduce(memo => memo += s[Math.floor(Math.random() * 26)], '');
}

const routes = [];

routes.push('/');

for (let i = 0; i < 200; i++) {
  const path = buildRandomRoute();
  routes.push('/' + path);
  routes.push('/' + path + '/:id');
  for (let i = 0; i < 10; i++) {
    routes.push('/' + path + '/:id/' + buildRandomRoute());
  }
}


// route match path to regexp way
const pathToRegexp = require('path-to-regexp')
const p2rRoutes = routes.map(r => pathToRegexp(r));

// route match flexrouter way
const Flexrouter = require('../dist').default;
const fr = new Flexrouter();
routes.forEach(r => fr.insert({path: r, data: true}))

// pick a random path to benchmark
const i = Math.floor(Math.random() * routes.length);
const path = routes[i].replace(':id', '1');

console.log(`benchmark home path: '/', and a random path: '${path}'`)

suite
  .add('path-to-regexp#home', () => {
    p2rRoutes.forEach(re => re.exec('/'));
  })
  .add('flexrouter#home', () => {
    fr.lookup('/');
  })
  .add('path-to-regexp#topic-detail', () => {
    p2rRoutes.forEach(re => re.exec(path));
  })
  .add('flexrouter#topic-detail', () => {
    fr.lookup(path);
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', () => {})
  .run({async: true})
