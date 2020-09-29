// @ts-nocheck

import fetchMock from 'fetch-mock';

import postDiscordChannelMessage from './discord';

afterEach(() => {
  jest.clearAllMocks();
  fetchMock.restore();
});

describe('postDiscordChannelMessage', () => {
  it('Posts a Discord channel message successfully', async () => {
    fetchMock.post('begin:https://discord.com/api/', {});

    await postDiscordChannelMessage('hello world');

    expect(fetchMock.calls().length).toBe(1);
    expect(fetchMock.calls()[0][0]).toBe('https://discord.com/api/channels/test_discord_channel/messages');
    expect(fetchMock.calls()[0][1]).toStrictEqual({
      method: 'POST',
      headers: {
        Authorization: 'Bot test_discord_bot_token',
        'Content-type': 'application/json',
      },
      body: '{"content":"hello world"}',
    });
  });
});
