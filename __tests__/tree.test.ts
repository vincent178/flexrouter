import { RadixTreeTree } from '../src/tree';

test('radix tree insert and find 1', () => {
  const tree = new RadixTreeTree<number>();

  tree.insert('a', 1);
  tree.insert('b', 2);

  expect(Object.keys(tree['root'].children).length).toBe(2);
  expect(Object.keys(tree['root'].children['a'].children).length).toBe(0);
  expect(Object.keys(tree['root'].children['b'].children).length).toBe(0);
  expect(tree.find('a')).toBe(1);
  expect(tree.find('b')).toBe(2);
});

test('radix tree insert and find 2', () => {
  const tree = new RadixTreeTree<number>();

  tree.insert('a', 1);
  tree.insert('ab', 2);

  expect(Object.keys(tree['root'].children).length).toBe(1);
  expect(Object.keys(tree['root'].children['a'].children).length).toBe(1);
  expect(Object.keys(tree['root'].children['a'].children['b'].children).length).toBe(0);
  expect(tree.find('a')).toBe(1);
  expect(tree.find('ab')).toBe(2);
});

test('radix tree insert and find 3', () => {
  const tree = new RadixTreeTree<number>();

  tree.insert('ab', 1);
  tree.insert('a', 2);

  expect(Object.keys(tree['root'].children).length).toBe(1);
  expect(Object.keys(tree['root'].children['a'].children).length).toBe(1);
  expect(Object.keys(tree['root'].children['a'].children['b'].children).length).toBe(0);
  expect(tree.find('ab')).toBe(1);
  expect(tree.find('a')).toBe(2);
});

test('radix tree insert and find 4', () => {
  const tree = new RadixTreeTree<number>();

  tree.insert('ab', 1);
  tree.insert('ac', 2);

  expect(Object.keys(tree['root'].children).length).toBe(1);
  expect(Object.keys(tree['root'].children['a'].children).length).toBe(2);
  expect(Object.keys(tree['root'].children['a'].children['b'].children).length).toBe(0);
  expect(Object.keys(tree['root'].children['a'].children['c'].children).length).toBe(0);
  expect(tree.find('ab')).toBe(1);
  expect(tree.find('ac')).toBe(2);
});

test('radix tree insert and find 5', () => {
  const tree = new RadixTreeTree<number>();

  tree.insert('ac', 1);
  tree.insert('bc', 2);

  expect(Object.keys(tree['root'].children).length).toBe(2);
  expect(Object.keys(tree['root'].children['a'].children).length).toBe(0);
  expect(Object.keys(tree['root'].children['b'].children).length).toBe(0);

  expect(tree.find('ac')).toBe(1);
  expect(tree.find('bc')).toBe(2);
});
