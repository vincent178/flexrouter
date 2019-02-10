Flexrouter
==========

> A flexible and crazy fast router solution, internally uses a high performance [Radix tree](https://en.wikipedia.org/wiki/Radix_tree), and it's framework independent, for both frontend and backend.

## Features

**Best Performance:** crazy fast using radix tree lookup instead of regexp match loop

**Flexible:** suitable for both http framework like `express` `koa` even without any framework, or frontend framework like `React` `vue`, checkout [examples](./examples)

**Param match and wildcard match:** support `/user/:name` parameter pattern and `/*site` wildcard pattern

## Usage

Flexrouter has only two API, `insert` is used to register a route, route is a plain javascript object.
```typescript
{
  path: string,
  data: T as any
}
```
`lookup` is used to find a match route giving a path, the result is an plain javascript object as well.
```typescript
{
  params: {[name: string]: string},
  data: T as any
}
```

```javascript
// you can use constructor to register route as well
const r = new Flexrouter([
  { path: '/', data: 'Home Page' },
  { path: '/topic/:id', data: 'Topic Page' }
]);

r.lookup('/topic/123') // returns { params: {id: '123'}, data: 'Topic Page' }
```
That's it.

## Support Patterns

1. static route: `/home`
2. param route: `/topic/:id`
3. param route with regex: `topic/photo-:id(/\\d+/).jpg`
4. wildcard route: `/*site`

## Performance

Compared to `path-to-regexp`, it has a similar performance result when there're 20 routes. When increase route to 2401, the performance result:
```
path-to-regexp#home x 4,247 ops/sec ±1.82% (83 runs sampled)
flexrouter#home x 4,856,189 ops/sec ±0.71% (88 runs sampled)
path-to-regexp#topic-detail x 4,247 ops/sec ±1.33% (86 runs sampled)
flexrouter#topic-detail x 1,254,182 ops/sec ±0.82% (88 runs sampled)
```
Checkout the [benchmark](./benchmark/index.js) code.

## Credit

Inspired by httprouter https://github.com/julienschmidt/httprouter and find-my-way https://github.com/delvedor/find-my-way
