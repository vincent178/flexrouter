// import { Router } from '../src/router';
import Router from '../src';

const r = new Router([
  { path: '/:id/:new_id', data: 'T' }
])

debugger;

const ret = r.lookup('/1/2');

console.log(ret);
