const Flexrouter = require('../../dist').default;

class HttpRouter {

  constructor() {
    this.router = new Flexrouter();
  }

  on(method, route, handler) {
    const ret = this.router.lookup(route);
    if (ret && ret.data && ret.data[method]) {
      throw new Error(`can register the same ${method} for route ${route}`);
    }
    if (ret && ret.data) {
      const data = ret.data;
      data[method] = handler;
      this.router.insert({
        path: route,
        data
      });
    } else {
      const data = {[method]: handler};
      this.router.insert({
        path: route,
        data
      });
    }
  }

  lookup(req, res) {
    const route = req.url.split("?")[0];
    const method = req.method;
    const ret = this.router.lookup(route);
    if (!ret) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    const handler = ret.data[method];
    if (!handler) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    req.params = ret.params;
    let rawBody = '';
    req.on('data', chunk => rawBody += chunk)
    req.on('end', () => {
      req.rawBody = rawBody;
      return handler.call(null, req, res);
    });
  }
}

module.exports = new HttpRouter();
