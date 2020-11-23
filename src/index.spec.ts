import cron from 'node-cron';

import postResetMessage from './reset';
import postRealmStatus from './realm';

import './index';

jest.mock('node-cron', () => ({
  schedule: jest.fn((_expression, callback) => callback()),
}));

jest.mock('./reset', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./realm', () => ({
  __esModule: true,
  default: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('index', () => {
  it('cron schedules were set up correctly', () => {
    expect(cron.schedule).toHaveBeenCalledTimes(2);
    expect(cron.schedule).toHaveBeenNthCalledWith(1, '0 15 * * *', expect.any(Function));
    expect(cron.schedule).toHaveBeenNthCalledWith(2, '*/5 * * * *', expect.any(Function));

    expect(postResetMessage).toHaveBeenCalledTimes(1);

    expect(postRealmStatus).toHaveBeenCalledTimes(2);
    expect(postRealmStatus).toHaveBeenNthCalledWith(1, 'test_realm_slug_1');
    expect(postRealmStatus).toHaveBeenNthCalledWith(2, 'test_realm_slug_2');
  });
});
