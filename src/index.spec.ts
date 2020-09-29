/* eslint-disable import/named */
// @ts-nocheck

import { handler } from './index';
import postDiscordChannelMessage from './discord';

jest.mock('./discord', () => ({
  __esModule: true,
  default: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('handler', () => {
  it('Tests handler callback invocation', () => {
    const callback = jest.fn();

    handler(
      null,
      null,
      callback,
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenNthCalledWith(1, null);
  });

  it('Tests daily reset event', () => {
    handler(
      { type: 'reset-event' },
      null,
      jest.fn(),
      0,
    );

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(1, ':tada: Daily quests have reset');
  });

  it('Tests weekly reset event', () => {
    handler(
      { type: 'reset-event' },
      null,
      jest.fn(),
      2,
    );

    expect(postDiscordChannelMessage).toHaveBeenCalledTimes(1);
    expect(postDiscordChannelMessage).toHaveBeenNthCalledWith(1, ':tada: Daily quests and raids have been reset');
  });
});
