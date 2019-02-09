import { getCommonLen } from '../src/util';

test('getCommonLen', () => {

  expect(getCommonLen('123', '12')).toBe(2);
  expect(getCommonLen('123', '123')).toBe(3);
  expect(getCommonLen('123', '1234')).toBe(3);

});
