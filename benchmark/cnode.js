

const p2rRoutes = [];
const pathToRegexp = require('path-to-regexp')

const rs = [
  '/',
  '/sitemap.xml',
  '/app/download',
  '/signup',
  '/signin',
  '/active_account', 
  '/search_pass',
  '/reset_pass',
  '/user/:name',
  '/setting',
  '/stars',
  '/users/top100',
  '/user/:name/collections',
  '/user/:name/topics', 
  '/user/:name/replies',
  '/topic/create',
  '/topic/:tid',
  '/topic/:tid/edit',
  '/reply/:reply_id/edit',
  '/about',
  '/faq',
  '/getstart',
  '/robots.txt',
  '/api',
  '/rss',
  '/auth/github',
  '/auth/github/callback',
  '/auth/github/new',
  '/search',
]


// check logic https://github.com/ZijianHe/koa-router/blob/master/lib/router.js#L651
rs.forEach(r => p2rRoutes.push(pathToRegexp(r)));


const Flexrouter = require('../dist').default;
const fr = new Flexrouter();

rs.forEach(r => fr.insert({path: r, data: true}))

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;


suite
  .add('path-to-regexp#home', () => {
    p2rRoutes.forEach(re => re.exec('/'));
  })
  .add('flexrouter#home', () => {
    fr.lookup('/');
  })
  .add('path-to-regexp#topic-detail', () => {
    p2rRoutes.forEach(re => re.exec('/topic/123'));
  })
  .add('flexrouter#topic-detail', () => {
    fr.lookup('/topic/123');
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', () => {})
  .run({async: true})
