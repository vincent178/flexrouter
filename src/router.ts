import { RadixTreeNode, RadixTreeTree } from './tree';

interface Route<T> {
  path: string;
  data: T;
}

export enum RouteNodeType {
  STATIC,
  PARAM,
  REGEX,
  WILDCARD
}

export interface RouteNode<T> {
  kind: RouteNodeType;
  data?: T;
  params?: string[];
  regex?: RegExp[];
}

export interface RouteResult<T> {
  data?: T;
  params: {[name: string]: string}
}

export class Router<T extends any> {

  tree: RadixTreeTree<RouteNode<T>>;

  constructor(routes: Route<T>[]) {
    this.tree = new RadixTreeTree();
    routes.forEach(route => this.insert(route));
  }

  lookup(path: string, node?: RadixTreeNode<RouteNode<T>>, pValues?: string[]): RouteResult<T> {
    pValues = pValues || [];
    if (node) {
      let child = node.findChild(':');
      if (child) {
        let i = 0;
        while (path[i] !== '/' && i < path.length) i++;

        pValues.push(path.slice(0, i));

        // : as the last segement
        if (i === path.length) {
          return {
            data: child.value.data,
            params: this.buildParams(child.value.params, pValues)
          }
        }

        path = path.slice(i);
        node = child;
      } else {
        child = node.findChild('*');
        if (child) {
          pValues.push(path);
          return {
            data: child.value.data,
            params: this.buildParams(child.value.params, pValues)
          }
          // check for wildcard case
        } else {
          return null;
        }
      }
    } else {
      node = this.tree.root;
      if (/^\/.+/.test(path)) path = path.slice(1);
    }
    const pNodes = [];

    // save the rest path as first item, and the slash node as second, 
    pNodes.push([path, node, pValues]);

    while (path.length > 0) {
      const cn = node.findChild(path);
      if (cn) {
        path = path.slice(cn.prefix.length);
        if (cn.prefix[cn.prefix.length-1] === '/' && (cn.findChild(':') || cn.findChild('*'))) {
          pNodes.push([path, cn, pValues]);
        }
        node = cn;
        continue;
      }
      break;
    }

    if (path.length > 0) {
      // try another until no other way
      while (pNodes.length > 0) {
        const [path, node, pValues] = pNodes.pop();
        const ret = this.lookup(path, node, pValues);
        if (ret) return ret;
      }

      // tried everyway, still not found
      return null;
    }

    // finally return 
    return {
      params: this.buildParams(node.value.params, pValues),
      data: node.value.data
    };
  }

  insert(route: Route<T>) {
    let path = route.path;
    if (path[0] === '/' && path.length > 1) {
      path = path.slice(1);
    }

    const params = [];

    for (let i = 0, l = path.length; i < l; i++) {
      if (path[i] === ':') {
        this.tree.insert(path.slice(0, i), {
          kind: RouteNodeType.STATIC
        });

        // save param name
        let j = i+1;
        while (path[i] !== '/' && i < l) i++;
        params.push(path.slice(j, i));

        // save as new path
        path = path.slice(0, j) + path.slice(i);

        // path ends with param part
        if (i === l) {
          this.tree.insert(path, {
            kind: RouteNodeType.PARAM,
            data: route.data,
            params
          });
          return;
        }
        this.tree.insert(path.slice(0, j), {
          kind: RouteNodeType.PARAM,
        });
        i = j;
      } else if (path[i] === '*') {
        this.tree.insert(path.slice(0, i), {
          kind: RouteNodeType.STATIC
        });

        params.push(path.slice(i+1));
        this.tree.insert(path.slice(0, i+1), {
          kind: RouteNodeType.WILDCARD,
          data: route.data,
          params
        });
        return;
      } 
    }

    this.tree.insert(path, {
      kind: RouteNodeType.STATIC,
      data: route.data,
      params: params
    });
  }

  private buildParams(names: string[], values: string[]) {
    const ret = {};
    for (let i = 0; i < names.length; i++) {
      ret[names[i]] = values[i];
    }
    return ret;
  }
}
