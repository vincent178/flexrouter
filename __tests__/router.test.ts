import { Router } from '../src/router'

test('build a radix router tree', () => {
  const router = new Router([
    {
      path: '/:id/show',
      data: 'T1'
    },
    {
      path: '/show/data',
      data: 'T2'
    },
    {
      path: '/:id/data/:new_id',
      data: 'T3'
    }
  ])

  expect(router.tree.root.prefix).toBe("");

  // 2nd level
  expect(router.tree.root.children[':'].prefix).toBe(":")
  expect(router.tree.root.children['s'].prefix).toBe("show/data")

  // 3rd level
  expect(router.tree.root.children[':'].children['/'].prefix).toBe("/")

  // 4th 
  expect(router.tree.root.children[':'].children['/'].children['d'].prefix).toBe("data/")
  expect(router.tree.root.children[':'].children['/'].children['s'].prefix).toBe("show")

  // 5th
  expect(router.tree.root.children[':'].children['/'].children['d'].children[':'].prefix).toBe(":")

  // 6th
  expect(Object.keys(router.tree.root.children[':'].children['/'].children['d'].children[':'].children).length).toBe(0)
});

test('find static routes', () => {
  const router = new Router([
    { path: '/', data: 'Home' },
    { path: '/sub1', data: 'Sub1' },
    { path: '/sub2', data: 'Sub2' }
  ])

  expect(router.lookup('/').data).toBe('Home');
  expect(router.lookup('/sub1').data).toBe('Sub1');
  expect(router.lookup('/sub2').data).toBe('Sub2');
});

test('find param routes', () => {
  const router = new Router([
    { path: '/topics', data: 'Topics' },
    { path: '/topics/:id', data: 'Topic' },
    { path: '/topics/:id/bo', data: 'Bo' }
  ])

  expect(router.lookup('/topics').data).toBe('Topics');
  expect(router.lookup('/topics/123').data).toBe('Topic');
  expect(router.lookup('/topics/123').params.id).toBe('123');
  expect(router.lookup('/topics/123/bo').data).toBe('Bo');
  expect(router.lookup('/topics/123/bo').params.id).toBe('123');
});

test('complex route match', () => {

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

  expect(router.lookup('/a/b/c').data).toBe('h1');
  expect(router.lookup('/a/c/d').data).toBe('h2');
  expect(router.lookup('/a/c/a').data).toBe('h3');
  expect(router.lookup('/a/c/e').data).toBe('h4');
})

test('route contains dash', () => {
  const r = new Router([{
    path: '/a/:param/b', data: 'T'
  }])

  expect(r.lookup('/a/foo-bar/b').data).toBe('T');
});

test('route with multiple param', () => {
  const r = new Router([
    { path: '/:id/:new_id', data: 'T' }
  ])

  const ret = r.lookup('/1/2');
  expect(ret.params.id).toBe('1');
  expect(ret.params.new_id).toBe('2');
  expect(ret.data).toBe('T');
})

test('route with wildcard param', () => {
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
      path: '/a/*c', data: 'h4'
    }
  ]);

  const ret = router.lookup('/a/c/e');
  expect(ret.data).toBe('h4');
  expect(ret.params.c).toBe('c/e');
})

test('route with multiple param and wildcard param', () => {
  const r = new Router([
    { path: '/:id/*new_id', data: 'T' }
  ])

  const ret = r.lookup('/a/c/e');

  expect(ret.data).toBe('T');
  expect(ret.params.id).toBe('a');
  expect(ret.params.new_id).toBe('c/e');
})
