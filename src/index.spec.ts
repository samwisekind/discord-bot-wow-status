// @ts-nocheck

import { handler } from './index';

afterEach(() => {
  jest.clearAllMocks();
});

it('tests handler callback invocation', () => {
  const callback = jest.fn();

  handler(null, null, callback);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenNthCalledWith(1, null);
});
