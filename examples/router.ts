import Router from '../src';

const router = new Router([
  {
    path: '/a/b/c', data: 'h1'
  },
  {
    path: '/a/c/d', data: 'h2'
  },
  {
    path: '/a/c/a', data: 'h3'
  },
  {
    path: '/:id/c/e', data: 'h4'
  }
]);


debugger;

const ret = router.lookup('/a/c/e').data

