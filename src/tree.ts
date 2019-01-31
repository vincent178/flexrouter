import { getCommonLen } from './util';

export class RadixTreeNode<T> {

  children: {[key: string]: RadixTreeNode<T>};
  value: T;
  prefix: string;

  constructor(prefix: string, value?: T) {
    this.prefix = prefix;
    this.children = {};
    this.value = value;
  }

  addChild(prefix: string, value: T) {
    this.children[prefix[0]] = new RadixTreeNode(prefix, value);
  }

  findChild(path: string) {
    return this.children[path[0]];
  }
}

export class RadixTreeTree<T> {

  root: RadixTreeNode<T>;

  constructor() {
    this.root = new RadixTreeNode<T>('', null);
  }

  insert(path: string, value: T, node?: RadixTreeNode<T>) {
    node = node || this.root;

    if (path === '') {
      node.value = value;
      return;
    }

    for (let key in node.children) {
      const child = node.children[key];
      const maxLen = getCommonLen(path, child.prefix);

      if (maxLen > 0) {
        if (maxLen === path.length && maxLen === child.prefix.length) {
          this.updateValue(child, value);
          return;
        }

        if (maxLen === path.length) {
          child.addChild(child.prefix.slice(maxLen), child.value);
          child.prefix = path;
          this.updateValue(child, value);
          return;
        }

        if (maxLen === child.prefix.length) {
          this.insert(path.slice(maxLen), value, child);
          return;
        }

        child.addChild(path.slice(maxLen), value);
        child.addChild(child.prefix.slice(maxLen), child.value);
        child.prefix = path.slice(0, maxLen);
        child.value = null;
        return;
      }
    }

    node.addChild(path, value);
    return;
  }

  find(path: string, node?: RadixTreeNode<T>): T {
    const child = this.findChild(path, node);
    return child ? child.value : null;
  }

  private findChild(path: string, node?: RadixTreeNode<T>): RadixTreeNode<T> {
    node = node || this.root;

    if (path === '') {
      return node;
    }

    for (let key in node.children) {
      const child = node.children[key];
      const maxLen = getCommonLen(path, child.prefix);

      if (maxLen > 0) {
        return this.findChild(path.slice(maxLen), child);
      }
    }
    return null;
  }

  private updateValue(node: RadixTreeNode<T>, nv: T) {
    if (Object.prototype.toString.call(nv) === "[object Array]") {
      node.value = [...node.value as any, ...nv as any] as any;
    } else if (Object.prototype.toString.call(nv) === "[object Object]") {
      node.value = {...node.value as any, ...nv as any} as any;
    } else {
      node.value = nv;
    }
  }
}
