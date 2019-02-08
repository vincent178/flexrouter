

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

const FindMyWay = require('find-my-way');
const findMyWay = new FindMyWay()

const p0 = '/static';
const p1 = '/user/xiaoming';
const p2 = '/test/test/test/test/test';
const p3 = '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t';

const r0 = '/static';
const r1 = '/user/:name';
const r2 = '/:a/:b/:c/:d/:e';
const r3 = '/:a/:b/:c/:d/:e/:f/:g/:h/:i/:j/:k/:l/:m/:n/:o/:p/:q/:r/:s/:t';

findMyWay.on('GET', r0, () => true)
findMyWay.on('GET', r1, () => true)
findMyWay.on('GET', r2, () => true)
findMyWay.on('GET', r3, () => true)

const Flexrouter = require('../dist').default;
const flexrouter = new Flexrouter([
  { path: r0, data: true },
  { path: r1, data: true },
  { path: r2, data: true },
  { path: r3, data: true }
]);

const pathToRegexp = require('path-to-regexp')
const pr0 = pathToRegexp(r0);
const pr1 = pathToRegexp(r1);
const pr2 = pathToRegexp(r2);
const pr3 = pathToRegexp(r3);

suite
  .add('find-my-way#static', () => {
    findMyWay.lookup({ method: 'GET', url: p0, headers: {} }, null);
  })
  .add('flexrouter#static', () => {
    flexrouter.lookup(p0);
  })
  .add('path-to-regexp#static', () => {
    pr0.exec(p0);
  })
  .add('find-my-way#one-param', () => {
    findMyWay.lookup({ method: 'GET', url: p1, headers: {} }, null);
  })
  .add('flexrouter#one-param', () => {
    flexrouter.lookup(p1);
  })
  .add('path-to-regexp#one-param', () => {
    pr1.exec(p1);
  })
  .add('find-my-way#five-param', () => {
    findMyWay.lookup({ method: 'GET', url: p2, headers: {} }, null);
  })
  .add('flexrouter#five-param', () => {
    flexrouter.lookup(p2);
  })
  .add('path-to-regexp#five-param', () => {
    pr2.exec(p2);
  })
  .add('find-my-way#20-param', () => {
    findMyWay.lookup({ method: 'GET', url: p3, headers: {} }, null);
  })
  .add('flexrouter#20-param', () => {
    flexrouter.lookup(p3);
  })
  .add('path-to-regexp#20-param', () => {
    pr3.exec(p3);
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', () => {})
  .run({async: true})

