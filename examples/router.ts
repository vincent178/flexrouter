// import { Router } from '../src/router';
import Router from '../src';

const r = new Router([
  { path: '/:id(^\\d*).png', data: 'T' }
])


debugger;

const ret = r.lookup('/12.png');

console.log(ret);
