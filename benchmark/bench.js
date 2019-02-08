

// var Benchmark = require('benchmark');
// var suite = new Benchmark.Suite;

const p1 = '/user/xiaoming';
const p2 = '/test/test/test/test/test';
const p3 = '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t';

const r1 = '/user/:name';
const r2 = '/:a/:b/:c/:d/:e';
const r3 = '/:a/:b/:c/:d/:e/:f/:g/:h/:i/:j/:k/:l/:m/:n/:o/:p/:q/:r/:s/:t';

const Flexrouter = require('../dist').default;
const flexrouter = new Flexrouter([
  { path: r1, data: true },
  { path: r2, data: true },
  { path: r3, data: true }
]);

for (let i = 0; i < 1000; i++) {
  flexrouter.lookup(p1);
}

// flexrouter.lookup(p2);
// flexrouter.lookup(p3);

// suite
//   .add('flexrouter#one-param', () => {
//     flexrouter.lookup(p1);
//   })
//   .add('flexrouter#five-param', () => {
//     flexrouter.lookup(p2);
//   })
//   .add('flexrouter#20-param', () => {
//     flexrouter.lookup(p3);
//   })
//   .on('cycle', (event) => {
//     console.log(String(event.target))
//   })
//   .on('complete', () => {})
//   .run({async: true})

