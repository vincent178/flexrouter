import { RadixTreeNode, RadixTreeTree } from './tree';
import { findCloseParenthesis, convertStringToRegex } from './util';

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
  regex?: RegExp;
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

        // if it's a regex param, use regex to match the path
        if (child.value.regex) {
          const match = child.value.regex.exec(path);
          if (match) {
            const sp = match[0]

            pValues.push(sp);

            if (sp.length === path.length) {
              return {
                data: child.value.data,
                params: this.buildParams(child.value.params, pValues)
              }
            }

            path = path.slice(sp.length);
            node = child;
          } else {
            return this.lookupWildcard(node, path, pValues);
          }
        } else {
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
        }
      } else {
        return this.lookupWildcard(node, path, pValues);
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
        if (cn.findChild(':') || cn.findChild('*')) {
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
      debugger;
      if (path[i] === ':') {
        let regex: RegExp

        this.tree.insert(path.slice(0, i), {
          kind: RouteNodeType.STATIC
        });

        // save param name
        let j = i+1;
        while (path[i] !== '/' && path[i] !== '(' && i < l) i++;

        // save param name
        params.push(path.slice(j, i));

        if (path[i] === '(') {
          const u = findCloseParenthesis(path, i);
          if (u > -1) {
            regex = new RegExp(path.slice(i+1, u));
            // regex = convertStringToRegex(path.slice(i+1, u));
            path = path.slice(0, j) + path.slice(u+1);
          } else {
            // keep moving forward until reach the end or `/`
            while (path[i] !== '/' && i < l) i++;
            path = path.slice(0, j) + path.slice(i);
          }
        } else {
          // save as new path
          path = path.slice(0, j) + path.slice(i);
        }

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
          regex
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

  private lookupWildcard(node, path, pValues) {
    const child = node.findChild('*');
    if (child) {
      pValues.push(path);
      return {
        data: child.value.data,
        params: this.buildParams(child.value.params, pValues)
      }
    } else {
      return null;
    }
  }
}
