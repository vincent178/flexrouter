import { RadixTreeTree } from '../src/tree';

const tree = new RadixTreeTree<number>();

tree.insert('a', 1);
tree.insert('b', 2);

debugger;

tree.find('a');
